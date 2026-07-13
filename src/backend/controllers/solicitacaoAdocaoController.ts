import { Request, Response, NextFunction } from 'express';
import * as db from '../config/db';
import { AppError } from '../errors/AppError';

export const listarSolicitacoes = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const queryText = `
      SELECT s.*, a.nome as pet_name
      FROM solicitacao_adocao s
      JOIN animal_adocao a ON s.id_animal_adocao = a.id_animal_adocao
      ORDER BY s.criado_em DESC
    `;
    const { rows } = await db.query(queryText);

    const mapped = rows.map(r => ({
      id: r.id_solicitacao,
      pet: r.pet_name,
      nomeInteressado: r.nome_solicitante,
      telefone: r.telefone,
      email: r.email,
      idade: r.idade_solicitante,
      tipoMoradia: r.tipo_moradia,
      data: new Date(r.criado_em).toLocaleDateString('pt-BR'),
      status: r.status.toLowerCase(),
    }));

    res.json(mapped);
  } catch (error) {
    next(error);
  }
};

export const criarSolicitacao = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id_animal_adocao, nome_animal, id_cliente, nome_solicitante, telefone, email, idade_solicitante, tipo_moradia } = req.body;

  try {
    let resolvedAnimalId = id_animal_adocao;

    if (!resolvedAnimalId && nome_animal) {
      const animResult = await db.query(
        'SELECT id_animal_adocao FROM animal_adocao WHERE nome ILIKE $1 LIMIT 1',
        [nome_animal.trim()]
      );
      if (animResult.rows.length === 0) {
        throw new AppError(`Animal com nome "${nome_animal}" não encontrado para adoção.`, 404);
      }
      resolvedAnimalId = animResult.rows[0].id_animal_adocao;
    }

    if (!resolvedAnimalId) {
      throw new AppError('O animal para adoção deve ser especificado por ID ou nome.', 400);
    }

    const queryText = `
      INSERT INTO solicitacao_adocao
        (id_animal_adocao, id_cliente, nome_solicitante, telefone, email, idade_solicitante, tipo_moradia, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 'Pendente')
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [
      resolvedAnimalId, id_cliente || null, nome_solicitante,
      telefone, email, idade_solicitante, tipo_moradia,
    ]);

    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
};

export const atualizarSolicitacao = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const map: Record<string, string> = {
      pendente: 'Pendente', 'em análise': 'Em Análise', 'em analise': 'Em Análise',
      aprovada: 'Aprovada', aprovado: 'Aprovada',
      recusada: 'Recusada', recusado: 'Recusada',
    };
    const dbStatus = map[status.toLowerCase()] ?? status;

    const { rows } = await db.query(
      `UPDATE solicitacao_adocao SET status = $1 WHERE id_solicitacao = $2 RETURNING *`,
      [dbStatus, id]
    );

    if (rows.length === 0) {
      throw new AppError('Solicitação de adoção não encontrada.', 404);
    }

    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};
