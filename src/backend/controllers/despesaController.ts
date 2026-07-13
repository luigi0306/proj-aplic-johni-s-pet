import { Request, Response, NextFunction } from 'express';
import * as db from '../config/db';

export const listarDespesas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { categoria, de, ate } = req.query;
  try {
    const condicoes: string[] = [];
    const valores: any[] = [];

    if (categoria) {
      valores.push(categoria);
      condicoes.push(`categoria = $${valores.length}`);
    }
    if (de) {
      valores.push(de);
      condicoes.push(`data >= $${valores.length}`);
    }
    if (ate) {
      valores.push(ate);
      condicoes.push(`data <= $${valores.length}`);
    }

    const where = condicoes.length > 0 ? `WHERE ${condicoes.join(' AND ')}` : '';
    const { rows } = await db.query(
      `SELECT * FROM despesa ${where} ORDER BY data DESC, id_despesa DESC`,
      valores
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const criarDespesa = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { categoria, descricao, valor, data } = req.body;
  try {
    const dataFinal = data || new Date().toISOString().split('T')[0];
    const { rows } = await db.query(
      `INSERT INTO despesa (categoria, descricao, valor, data)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [categoria, descricao ?? null, valor, dataFinal]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};
