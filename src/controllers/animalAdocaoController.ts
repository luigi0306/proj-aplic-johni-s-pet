import { Request, Response, NextFunction } from 'express';
import * as db from '../config/db';

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
      res.status(404).json({ error: 'Animal not found' });
      return;
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
  const { nome, raca, porte, faixa_etaria, hist_medico, data_resgate, status, id_cliente_adotante } = req.body;
  try {
    const queryText = `
      UPDATE animal_adocao
      SET nome = $1, raca = $2, porte = $3, faixa_etaria = $4, hist_medico = $5, data_resgate = $6, status = $7, id_cliente_adotante = $8
      WHERE id_animal_adocao = $9
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [
      nome, raca, porte, faixa_etaria, hist_medico, data_resgate, status, id_cliente_adotante || null, id
    ]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Animal not found' });
      return;
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
      res.status(404).json({ error: 'Animal not found' });
      return;
    }
    res.json({ message: 'Adoption animal deleted successfully', animal: rows[0] });
  } catch (error) {
    next(error);
  }
};
