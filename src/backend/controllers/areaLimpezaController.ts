import { Request, Response, NextFunction } from 'express';
import * as db from '../config/db';
import { AppError } from '../errors/AppError';

export const listarAreas = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rows } = await db.query(`
      SELECT al.*, f.nome AS funcionario_nome
      FROM area_limpeza al
      LEFT JOIN funcionario f ON f.id_funcionario = al.id_funcionario
      ORDER BY al.nome
    `);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// req.funcionario vem do middleware autenticarFuncionario (ver authFuncionario.ts):
// gravamos automaticamente quem foi o último a atualizar a área.
export const atualizarStatusArea = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;
  const idFuncionario = req.funcionario?.id_funcionario ?? null;
  try {
    const { rows } = await db.query(
      `UPDATE area_limpeza
       SET status = $1, atualizado_em = now(), id_funcionario = $2
       WHERE id_area = $3
       RETURNING *`,
      [status, idFuncionario, id]
    );
    if (rows.length === 0) {
      throw new AppError('Área de limpeza não encontrada.', 404);
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};
