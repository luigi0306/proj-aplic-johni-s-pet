import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool, query } from '../config/db';
import { AppError } from '../errors/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'chew-dev-secret';
const JWT_EXPIRES_IN = '7d';

export const cadastro = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { cpf, nome, telefone, endereco, email, senha } = req.body;
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const clienteResult = await client.query(
      `INSERT INTO cliente (cpf, nome, telefone, endereco)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [cpf, nome, telefone, endereco]
    );
    const cliente = clienteResult.rows[0];

    const senhaHash = await bcrypt.hash(senha, 10);
    await client.query(
      `INSERT INTO usuario (id_cliente, email, senha_hash)
       VALUES ($1, $2, $3)`,
      [cliente.id_cliente, email, senhaHash]
    );

    await client.query('COMMIT');

    const token = jwt.sign({ id_cliente: cliente.id_cliente, nome: cliente.nome }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.status(201).json({ token, cliente });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, senha } = req.body;
  try {
    const { rows } = await query(
      `SELECT u.id_usuario, u.senha_hash, c.id_cliente, c.nome, c.cpf, c.telefone, c.endereco
       FROM usuario u
       JOIN cliente c ON c.id_cliente = u.id_cliente
       WHERE u.email = $1`,
      [email]
    );

    if (rows.length === 0) {
      throw new AppError('Email ou senha inválidos.', 401);
    }

    const usuario = rows[0];
    const senhaConfere = await bcrypt.compare(senha, usuario.senha_hash);
    if (!senhaConfere) {
      throw new AppError('Email ou senha inválidos.', 401);
    }

    await query('UPDATE usuario SET ultimo_login = now() WHERE id_usuario = $1', [usuario.id_usuario]);

    const token = jwt.sign({ id_cliente: usuario.id_cliente, nome: usuario.nome }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({
      token,
      cliente: {
        id_cliente: usuario.id_cliente,
        nome: usuario.nome,
        cpf: usuario.cpf,
        telefone: usuario.telefone,
        endereco: usuario.endereco,
        email,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await query('SELECT * FROM cliente WHERE id_cliente = $1', [req.cliente!.id_cliente]);
    if (rows.length === 0) {
      throw new AppError('Cliente não encontrado.', 404);
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const atualizarPerfil = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const updates = req.body;
  try {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`);
    if (fields.length === 0) {
      throw new AppError('Nenhum campo para atualização foi enviado.', 400);
    }
    const { rows } = await query(
      `UPDATE cliente SET ${fields.join(', ')} WHERE id_cliente = $${fields.length + 1} RETURNING *`,
      [...Object.values(updates), req.cliente!.id_cliente]
    );
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};