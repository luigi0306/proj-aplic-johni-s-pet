import { Request, Response, NextFunction } from 'express';
import * as db from '../config/db';
import { AppError } from '../errors/AppError';

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
      throw new AppError('Funcionário não encontrado.', 404);
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
  const updates = req.body;
  try {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`);
    if (fields.length === 0) {
      throw new AppError('Nenhum campo para atualização foi enviado.', 400);
    }
    const queryText = `
      UPDATE funcionario
      SET ${fields.join(', ')}
      WHERE id_funcionario = $${fields.length + 1}
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [...Object.values(updates), id]);
    if (rows.length === 0) {
      throw new AppError('Funcionário não encontrado.', 404);
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
      throw new AppError('Funcionário não encontrado.', 404);
    }
    res.json({ message: 'Employee deleted successfully', employee: rows[0] });
  } catch (error) {
    next(error);
  }
};
