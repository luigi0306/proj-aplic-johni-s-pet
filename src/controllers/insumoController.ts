import { Request, Response, NextFunction } from 'express';
import * as db from '../config/db';
import { AppError } from '../errors/AppError';

// List all insumos
export const listarInsumos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await db.query('SELECT * FROM insumos ORDER BY id_insumo DESC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Find insumo by ID
export const buscarInsumoPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM insumos WHERE id_insumo = $1', [id]);
    if (rows.length === 0) {
      throw new AppError('Insumo não encontrado.', 404);
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Create new insumo
export const criarInsumo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { nome, quantidade_estoque } = req.body;
  try {
    const queryText = `
      INSERT INTO insumos (nome, quantidade_estoque)
      VALUES ($1, $2)
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [nome, quantidade_estoque || 0]);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Update insumo
export const atualizarInsumo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`);
    if (fields.length === 0) {
      throw new AppError('Nenhum campo para atualização foi enviado.', 400);
    }
    const queryText = `
      UPDATE insumos
      SET ${fields.join(', ')}
      WHERE id_insumo = $${fields.length + 1}
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [...Object.values(updates), id]);
    if (rows.length === 0) {
      throw new AppError('Insumo não encontrado.', 404);
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Delete insumo
export const deletarInsumo = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM insumos WHERE id_insumo = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      throw new AppError('Insumo não encontrado.', 404);
    }
    res.json({ message: 'Insumo deleted successfully', insumo: rows[0] });
  } catch (error) {
    next(error);
  }
};

// Record insumo usage (triggers automatic database updates)
export const registrarUso = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id_insumo, quantidade_usada, data_uso } = req.body;
  try {
    const insumoCheck = await db.query('SELECT quantidade_estoque FROM insumos WHERE id_insumo = $1', [id_insumo]);
    if (insumoCheck.rows.length === 0) {
      throw new AppError('Insumo não encontrado.', 404);
    }

    const currentStock = insumoCheck.rows[0].quantidade_estoque;
    if (currentStock < quantidade_usada) {
      throw new AppError(
        `Estoque insuficiente do insumo. Disponível: ${currentStock}, solicitado: ${quantidade_usada}.`,
        400
      );
    }

    const queryText = `
      INSERT INTO uso_insumo (id_insumo, quantidade_usada, data_uso)
      VALUES ($1, $2, $3)
      RETURNING *
    `;
    const useDate = data_uso || new Date().toISOString().split('T')[0];
    const { rows } = await db.query(queryText, [id_insumo, quantidade_usada, useDate]);
    
    res.status(201).json({
      message: 'Usage recorded successfully. Insumo stock updated by database trigger.',
      uso: rows[0]
    });
  } catch (error) {
    next(error);
  }
};

// List all usage logs
export const listarUsos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await db.query(`
      SELECT ui.*, i.nome as insumo_nome 
      FROM uso_insumo ui
      JOIN insumos i ON ui.id_insumo = i.id_insumo
      ORDER BY ui.data_uso DESC, ui.id_uso DESC
    `);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
