import { Request, Response, NextFunction } from 'express';
import * as db from '../config/db';

export const listarProdutos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await db.query('SELECT * FROM produto ORDER BY id_produto DESC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const buscarProdutoPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM produto WHERE id_produto = $1', [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const criarProduto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { nome, preco, categoria, estoque_atual } = req.body;
  try {
    const queryText = `
      INSERT INTO produto (nome, preco, categoria, estoque_atual)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [nome, preco, categoria, estoque_atual || 0]);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const atualizarProduto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`);
    if (fields.length === 0) {
      res.status(400).json({ error: 'Nenhum campo para atualização foi enviado.' });
      return;
    }
    const queryText = `
      UPDATE produto
      SET ${fields.join(', ')}
      WHERE id_produto = $${fields.length + 1}
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [...Object.values(updates), id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deletarProduto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM produto WHERE id_produto = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted successfully', product: rows[0] });
  } catch (error) {
    next(error);
  }
};
