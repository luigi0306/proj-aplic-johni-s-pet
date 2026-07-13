import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../errors/AppError';

const JWT_SECRET = process.env.JWT_SECRET || 'chew-dev-secret';

interface FuncionarioPayload {
  id_funcionario: number;
  cargo: string;
  nome: string;
}

// Extensão do tipo Request do Express para carregar o funcionário autenticado
declare global {
  namespace Express {
    interface Request {
      funcionario?: FuncionarioPayload;
    }
  }
}

// Verifica se o header Authorization: Bearer <token> é válido.
// Use em qualquer rota do painel do funcionário que precise de login.
export const autenticarFuncionario = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    next(new AppError('Token de autenticação não informado.', 401));
    return;
  }

  const token = authHeader.substring('Bearer '.length);
  try {
    const payload = jwt.verify(token, JWT_SECRET) as FuncionarioPayload;
    req.funcionario = payload;
    next();
  } catch {
    next(new AppError('Token inválido ou expirado.', 401));
  }
};

// Restringe a rota a determinados cargos. Use DEPOIS de autenticarFuncionario.
// Exemplo: router.post('/', autenticarFuncionario, permitirCargos('Gerente'), controller.criar)
export const permitirCargos = (...cargosPermitidos: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.funcionario) {
      next(new AppError('Não autenticado.', 401));
      return;
    }
    if (!cargosPermitidos.includes(req.funcionario.cargo)) {
      next(new AppError('Você não tem permissão para acessar este recurso.', 403));
      return;
    }
    next();
  };
};
