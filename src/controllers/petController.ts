import { Request, Response, NextFunction } from 'express';
import * as db from '../config/db';

export const listarPets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await db.query('SELECT * FROM pet ORDER BY id_pet DESC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const buscarPetPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM pet WHERE id_pet = $1', [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const criarPet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { nome, raca, porte, faixa_etaria, hist_medico, id_cliente } = req.body;
  try {
    const clientCheck = await db.query('SELECT 1 FROM cliente WHERE id_cliente = $1', [id_cliente]);
    if (clientCheck.rows.length === 0) {
      res.status(400).json({ error: 'Invalid client ID. Client must exist to register a pet.' });
      return;
    }

    const queryText = `
      INSERT INTO pet (nome, raca, porte, faixa_etaria, hist_medico, id_cliente)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [nome, raca, porte, faixa_etaria, hist_medico, id_cliente]);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const atualizarPet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { nome, raca, porte, faixa_etaria, hist_medico, id_cliente } = req.body;
  try {
    if (id_cliente) {
      const clientCheck = await db.query('SELECT 1 FROM cliente WHERE id_cliente = $1', [id_cliente]);
      if (clientCheck.rows.length === 0) {
        res.status(400).json({ error: 'Invalid client ID.' });
        return;
      }
    }

    const queryText = `
      UPDATE pet
      SET nome = $1, raca = $2, porte = $3, faixa_etaria = $4, hist_medico = $5, id_cliente = $6
      WHERE id_pet = $7
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [nome, raca, porte, faixa_etaria, hist_medico, id_cliente, id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deletarPet = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM pet WHERE id_pet = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Pet not found' });
      return;
    }
    res.json({ message: 'Pet deleted successfully', pet: rows[0] });
  } catch (error) {
    next(error);
  }
};
