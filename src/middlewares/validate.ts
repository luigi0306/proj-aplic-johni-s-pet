import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny, ZodError } from 'zod';

export const validateBody = (schema: ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({
          error: 'Erro de validação',
          details: error.issues.map(issue => ({
            campo: issue.path.join('.'),
            mensagem: issue.message
          }))
        });
        return;
      }
      next(error);
    }
  };
};
