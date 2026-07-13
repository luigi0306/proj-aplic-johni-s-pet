import { Request, Response, NextFunction } from 'express';
import * as db from '../config/db';
import { AppError } from '../errors/AppError';

export const listarPedidos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await db.query(`
      SELECT pi.*, i.nome AS insumo_nome
      FROM pedido_insumo pi
      JOIN insumos i ON i.id_insumo = pi.id_insumo
      ORDER BY pi.criado_em DESC
    `);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const criarPedido = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id_insumo, quantidade } = req.body;
  try {
    const { rows } = await db.query(
      `INSERT INTO pedido_insumo (id_insumo, quantidade)
       VALUES ($1, $2)
       RETURNING *`,
      [id_insumo, quantidade]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Marca o pedido como comprado. Note que isso NÃO atualiza insumos.quantidade_estoque
// sozinho — se quiserem que a compra já reabasteça o estoque automaticamente,
// avisem que a gente adiciona esse UPDATE aqui dentro (ou uma trigger no banco).
export const atualizarStatusPedido = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const { rows } = await db.query(
      'UPDATE pedido_insumo SET status = $1 WHERE id_pedido = $2 RETURNING *',
      [status, id]
    );
    if (rows.length === 0) {
      throw new AppError('Pedido de insumo não encontrado.', 404);
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};
