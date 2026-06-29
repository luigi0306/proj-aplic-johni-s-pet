import { Request, Response, NextFunction } from 'express';
import * as db from '../config/db';

export const listarClientes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await db.query('SELECT * FROM cliente ORDER BY id_cliente DESC');
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

export const buscarClientePorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('SELECT * FROM cliente WHERE id_cliente = $1', [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const criarCliente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { cpf, nome, telefone, endereco } = req.body;
  try {
    const queryText = `
      INSERT INTO cliente (cpf, nome, telefone, endereco)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [cpf, nome, telefone, endereco]);
    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const atualizarCliente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`);
    if (fields.length === 0) {
      res.status(400).json({ error: 'Nenhum campo para atualização foi enviado.' });
      return;
    }
    const queryText = `
      UPDATE cliente
      SET ${fields.join(', ')}
      WHERE id_cliente = $${fields.length + 1}
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [...Object.values(updates), id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const deletarCliente = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const { rows } = await db.query('DELETE FROM cliente WHERE id_cliente = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Client not found' });
      return;
    }
    res.json({ message: 'Client deleted successfully', client: rows[0] });
  } catch (error) {
    next(error);
  }
};

export const pesquisarClientesPorNome = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { nome } = req.query;
  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    res.status(400).json({ error: 'Query param "nome" é obrigatório.' });
    return;
  }
  try {
    const { rows } = await db.query(
      `SELECT * FROM cliente WHERE nome ILIKE $1 ORDER BY nome ASC`,
      [`%${nome.trim()}%`]
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
};
