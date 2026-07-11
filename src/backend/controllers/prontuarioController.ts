import { Request, Response, NextFunction } from 'express';
import * as db from '../config/db';
import { AppError } from '../errors/AppError';

export const listarProntuarios = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await db.query(`
      SELECT pr.*, p.nome as pet_nome, f.nome as funcionario_nome 
      FROM prontuario pr
      LEFT JOIN pet p ON pr.id_pet = p.id_pet
      LEFT JOIN funcionario f ON pr.id_funcionario = f.id_funcionario
      ORDER BY pr.data_atendimento DESC, pr.id_prontuario DESC
    `);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const buscarProntuarioPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const { rows } = await db.query(`
      SELECT pr.*, p.nome as pet_nome, f.nome as funcionario_nome 
      FROM prontuario pr
      LEFT JOIN pet p ON pr.id_pet = p.id_pet
      LEFT JOIN funcionario f ON pr.id_funcionario = f.id_funcionario
      WHERE pr.id_prontuario = $1
    `, [id]);
    if (rows.length === 0) {
      throw new AppError('Prontuário não encontrado.', 404);
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const criarProntuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id_pet, id_funcionario, data_atendimento, descricao } = req.body;
  try {
    const queryText = `
      INSERT INTO prontuario (id_pet, id_funcionario, data_atendimento, descricao)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const date = data_atendimento || new Date().toISOString().split('T')[0];
    const { rows } = await db.query(queryText, [id_pet, id_funcionario, date, descricao]);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const atualizarProntuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`);
    if (fields.length === 0) {
      throw new AppError('Nenhum campo para atualização foi enviado.', 400);
    }
    const queryText = `
      UPDATE prontuario
      SET ${fields.join(', ')}
      WHERE id_prontuario = $${fields.length + 1}
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [...Object.values(updates), id]);
    if (rows.length === 0) {
      throw new AppError('Prontuário não encontrado.', 404);
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deletarProntuario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM prontuario WHERE id_prontuario = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      throw new AppError('Prontuário não encontrado.', 404);
    }
    res.json({ message: 'Prontuario deleted successfully', prontuario: rows[0] });
  } catch (error) {
    next(error);
  }
};
