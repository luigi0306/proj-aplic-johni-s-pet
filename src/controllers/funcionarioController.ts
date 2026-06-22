import { Request, Response, NextFunction } from 'express';
import * as db from '../config/db';

export const listarFuncionarios = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await db.query('SELECT * FROM funcionario ORDER BY id_funcionario DESC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const buscarFuncionarioPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM funcionario WHERE id_funcionario = $1', [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const criarFuncionario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { cpf, nome, cargo, salario } = req.body;
  try {
    const queryText = `
      INSERT INTO funcionario (cpf, nome, cargo, salario)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [cpf, nome, cargo, salario]);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const atualizarFuncionario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { cpf, nome, cargo, salario } = req.body;
  try {
    const queryText = `
      UPDATE funcionario
      SET cpf = $1, nome = $2, cargo = $3, salario = $4
      WHERE id_funcionario = $5
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [cpf, nome, cargo, salario, id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deletarFuncionario = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM funcionario WHERE id_funcionario = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Employee not found' });
      return;
    }
    res.json({ message: 'Employee deleted successfully', employee: rows[0] });
  } catch (error) {
    next(error);
  }
};
