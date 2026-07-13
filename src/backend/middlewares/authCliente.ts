import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'chew-dev-secret';

interface ClientePayload {
  id_cliente: number;
  nome: string;
}

declare global {
  namespace Express {
    interface Request {
      cliente?: ClientePayload;
    }
  }
}

export const autenticarCliente = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError('Token de autenticação não informado.', 401));
    return;
  }

  const token = authHeader.substring('Bearer '.length);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as ClientePayload;
    req.cliente = payload;
    next();
  } catch {
    next(new AppError('Token inválido ou expirado.', 401));
  }
};