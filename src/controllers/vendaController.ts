import { Request, Response, NextFunction } from 'express';
import * as db from '../config/db';
import { AppError } from '../errors/AppError';

interface ProdutoVendidoInput {
  id_produto: number;
  quantidade: number;
}

// List all sales
export const listarVendas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const queryText = `
      SELECT v.*, 
             coalesce(json_agg(json_build_object('id_produto', p.id_produto, 'nome', p.nome, 'preco', p.preco, 'quantidade', vp.quantidade)) FILTER (WHERE p.id_produto IS NOT NULL), '[]') as produtos
      FROM venda v
      LEFT JOIN venda_produto vp ON v.id_venda = vp.id_venda
      LEFT JOIN produto p ON vp.id_produto = p.id_produto
      GROUP BY v.id_venda
      ORDER BY v.data_venda DESC, v.id_venda DESC
    `;
    const { rows } = await db.query(queryText);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Find sale by ID
export const buscarVendaPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const queryText = `
      SELECT v.*, 
             coalesce(json_agg(json_build_object('id_produto', p.id_produto, 'nome', p.nome, 'preco', p.preco, 'quantidade', vp.quantidade)) FILTER (WHERE p.id_produto IS NOT NULL), '[]') as produtos
      FROM venda v
      LEFT JOIN venda_produto vp ON v.id_venda = vp.id_venda
      LEFT JOIN produto p ON vp.id_produto = p.id_produto
      WHERE v.id_venda = $1
      GROUP BY v.id_venda
    `;
    const { rows } = await db.query(queryText, [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Sale not found' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Create new sale (transactional, updates product stocks)
export const criarVenda = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { data_venda, metodo_pagamento, valor_total, produtos } = req.body;

  if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
    res.status(400).json({ error: 'At least one product must be specified for a sale.' });
    return;
  }

  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Insert into venda
    const insertVendaQuery = `
      INSERT INTO venda (data_venda, metodo_pagamento, valor_total)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const saleDate = data_venda || new Date().toISOString().split('T')[0];
    const vendaResult = await client.query(insertVendaQuery, [saleDate, metodo_pagamento, valor_total]);
    const newVenda = vendaResult.rows[0];

    // 2. Loop through products
    for (const prod of produtos as ProdutoVendidoInput[]) {
      const { id_produto, quantidade } = prod;

      // 2.1 Fetch current product stock
      const prodResult = await client.query('SELECT estoque_atual, nome FROM produto WHERE id_produto = $1 FOR UPDATE', [id_produto]);
      if (prodResult.rows.length === 0) {
        throw new AppError(`Produto com ID ${id_produto} não encontrado.`, 404);
      }

      const product = prodResult.rows[0];
      if (product.estoque_atual < quantidade) {
        throw new AppError(
          `Estoque insuficiente para o produto "${product.nome}". Disponível: ${product.estoque_atual}, solicitado: ${quantidade}.`,
          400
        );
      }

      // 2.2 Deduct stock
      const updateStockQuery = `
        UPDATE produto
        SET estoque_atual = estoque_atual - $1
        WHERE id_produto = $2
      `;
      await client.query(updateStockQuery, [quantidade, id_produto]);

      // 2.3 Insert junction
      const insertJunctionQuery = `
        INSERT INTO venda_produto (id_venda, id_produto, quantidade)
        VALUES ($1, $2, $3)
      `;
      await client.query(insertJunctionQuery, [newVenda.id_venda, id_produto, quantidade]);
    }

    await client.query('COMMIT');
    res.status(201).json({
      ...newVenda,
      produtos
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};
