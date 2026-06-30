import { Request, Response, NextFunction } from 'express';
import * as db from '../config/db';
import { AppError } from '../errors/AppError';

export const listarAnimais = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await db.query('SELECT * FROM animal_adocao ORDER BY id_animal_adocao DESC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const buscarAnimalPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM animal_adocao WHERE id_animal_adocao = $1', [id]);
    if (rows.length === 0) {
      throw new AppError('Animal de adoção não encontrado.', 404);
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const criarAnimal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { nome, raca, porte, faixa_etaria, hist_medico, data_resgate, status, id_cliente_adotante } = req.body;
  try {
    const queryText = `
      INSERT INTO animal_adocao (nome, raca, porte, faixa_etaria, hist_medico, data_resgate, status, id_cliente_adotante)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;
    const resgate = data_resgate || new Date().toISOString().split('T')[0];
    const { rows } = await db.query(queryText, [
      nome, raca, porte, faixa_etaria, hist_medico, resgate, status || 'Disponível', id_cliente_adotante || null
    ]);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const atualizarAnimal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`);
    if (fields.length === 0) {
      throw new AppError('Nenhum campo para atualização foi enviado.', 400);
    }
    const queryText = `
      UPDATE animal_adocao
      SET ${fields.join(', ')}
      WHERE id_animal_adocao = $${fields.length + 1}
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [...Object.values(updates), id]);
    if (rows.length === 0) {
      throw new AppError('Animal de adoção não encontrado.', 404);
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deletarAnimal = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM animal_adocao WHERE id_animal_adocao = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      throw new AppError('Animal de adoção não encontrado.', 404);
    }
    res.json({ message: 'Adoption animal deleted successfully', animal: rows[0] });
  } catch (error) {
    next(error);
  }
};
