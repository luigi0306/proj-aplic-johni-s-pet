import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as db from '../config/db';
import { AppError } from '../errors/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'chew-dev-secret'; // troque no .env em produção
const JWT_EXPIRES_IN = '8h';

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { email, senha } = req.body;
  try {
    const { rows } = await db.query(
      `SELECT uf.id_usuario_funcionario, uf.id_funcionario, uf.email, uf.senha_hash,
              f.nome, f.cargo
       FROM usuario_funcionario uf
       JOIN funcionario f ON f.id_funcionario = uf.id_funcionario
       WHERE uf.email = $1`,
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

    await db.query(
      'UPDATE usuario_funcionario SET ultimo_login = now() WHERE id_usuario_funcionario = $1',
      [usuario.id_usuario_funcionario]
    );

    const token = jwt.sign(
      { id_funcionario: usuario.id_funcionario, cargo: usuario.cargo, nome: usuario.nome },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      token,
      funcionario: {
        id_funcionario: usuario.id_funcionario,
        nome: usuario.nome,
        cargo: usuario.cargo,
        email: usuario.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Criação de login para um funcionário já cadastrado (uso do Gerente, tela Equipe).
// A trigger trg_valida_cargo_login no banco já recusa cargos não autorizados
// (Estoquista, Groomer) — aqui só capturamos esse erro e devolvemos como 400.
export const criarLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id_funcionario, email, senha } = req.body;
  try {
    const senhaHash = await bcrypt.hash(senha, 10);

    const { rows } = await db.query(
      `INSERT INTO usuario_funcionario (id_funcionario, email, senha_hash)
       VALUES ($1, $2, $3)
       RETURNING id_usuario_funcionario, id_funcionario, email, criado_em`,
      [id_funcionario, email, senhaHash]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Retorna os dados do funcionário logado, a partir do token (rota "/me")
export const me = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    res.json(req.funcionario);
  } catch (error) {
    next(error);
  }
};
