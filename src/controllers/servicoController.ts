import { Request, Response, NextFunction } from 'express';
import * as db from '../config/db';
import { AppError } from '../errors/AppError';

export const listarServicos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await db.query('SELECT * FROM servico ORDER BY id_servico DESC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const buscarServicoPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM servico WHERE id_servico = $1', [id]);
    if (rows.length === 0) {
      throw new AppError('Serviço não encontrado.', 404);
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const criarServico = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { nome, preco_base } = req.body;
  try {
    const queryText = `
      INSERT INTO servico (nome, preco_base)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [nome, preco_base]);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const atualizarServico = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`);
    if (fields.length === 0) {
      throw new AppError('Nenhum campo para atualização foi enviado.', 400);
    }
    const queryText = `
      UPDATE servico
      SET ${fields.join(', ')}
      WHERE id_servico = $${fields.length + 1}
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [...Object.values(updates), id]);
    if (rows.length === 0) {
      throw new AppError('Serviço não encontrado.', 404);
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deletarServico = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM servico WHERE id_servico = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      throw new AppError('Serviço não encontrado.', 404);
    }
    res.json({ message: 'Service deleted successfully', service: rows[0] });
  } catch (error) {
    next(error);
  }
};
