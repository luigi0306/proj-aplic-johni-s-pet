import { Request, Response, NextFunction } from 'express';
import * as db from '../config/db';

interface ServicoInput {
  id_servico: number;
  preco_cobrado: number;
}

// List all appointments
export const listarAgendamentos = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const queryText = `
      SELECT a.*, p.nome as pet_name, f.nome as funcionario_name,
             coalesce(json_agg(json_build_object('id_servico', s.id_servico, 'nome', s.nome, 'preco_cobrado', asv.preco_cobrado)) FILTER (WHERE s.id_servico IS NOT NULL), '[]') as servicos
      FROM agendamento a
      LEFT JOIN pet p ON a.id_pet = p.id_pet
      LEFT JOIN funcionario f ON a.id_funcionario = f.id_funcionario
      LEFT JOIN agendamento_servico asv ON a.id_agendamento = asv.id_agendamento
      LEFT JOIN servico s ON asv.id_servico = s.id_servico
      GROUP BY a.id_agendamento, p.id_pet, f.id_funcionario
      ORDER BY a.data_agendamento DESC, a.hora DESC
    `;
    const { rows } = await db.query(queryText);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

// Find appointment by ID
export const buscarAgendamentoPorId = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const queryText = `
      SELECT a.*, p.nome as pet_name, f.nome as funcionario_name,
             coalesce(json_agg(json_build_object('id_servico', s.id_servico, 'nome', s.nome, 'preco_cobrado', asv.preco_cobrado)) FILTER (WHERE s.id_servico IS NOT NULL), '[]') as servicos
      FROM agendamento a
      LEFT JOIN pet p ON a.id_pet = p.id_pet
      LEFT JOIN funcionario f ON a.id_funcionario = f.id_funcionario
      LEFT JOIN agendamento_servico asv ON a.id_agendamento = asv.id_agendamento
      LEFT JOIN servico s ON asv.id_servico = s.id_servico
      WHERE a.id_agendamento = $1
      GROUP BY a.id_agendamento, p.id_pet, f.id_funcionario
    `;
    const { rows } = await db.query(queryText, [id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Create new appointment (transactional)
export const criarAgendamento = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id_pet, id_funcionario, data_agendamento, hora, status, valor_total, servicos } = req.body;
  
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    
    // 1. Insert appointment
    const insertAgendamentoQuery = `
      INSERT INTO agendamento (id_pet, id_funcionario, data_agendamento, hora, status, valor_total)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const agendamentoResult = await client.query(insertAgendamentoQuery, [
      id_pet, id_funcionario, data_agendamento, hora, status || 'Agendado', valor_total
    ]);
    
    const newAgendamento = agendamentoResult.rows[0];
    
    // 2. Insert items into agendamento_servico if present
    if (servicos && Array.isArray(servicos) && servicos.length > 0) {
      for (const svc of servicos as ServicoInput[]) {
        const insertJunctionQuery = `
          INSERT INTO agendamento_servico (id_agendamento, id_servico, preco_cobrado)
          VALUES ($1, $2, $3)
        `;
        await client.query(insertJunctionQuery, [newAgendamento.id_agendamento, svc.id_servico, svc.preco_cobrado]);
      }
    }
    
    await client.query('COMMIT');
    
    res.status(201).json({
      ...newAgendamento,
      servicos: servicos || []
    });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

// Update appointment
export const atualizarAgendamento = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const updates = req.body;
  try {
    const fields = Object.keys(updates).map((key, i) => `${key} = $${i + 1}`);
    if (fields.length === 0) {
      res.status(400).json({ error: 'Nenhum campo para atualização foi enviado.' });
      return;
    }
    const queryText = `
      UPDATE agendamento
      SET ${fields.join(', ')}
      WHERE id_agendamento = $${fields.length + 1}
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [...Object.values(updates), id]);
    if (rows.length === 0) {
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
};

// Delete appointment
export const deletarAgendamento = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');
    
    // Delete from junction first
    await client.query('DELETE FROM agendamento_servico WHERE id_agendamento = $1', [id]);
    
    // Delete agendamento
    const { rows } = await client.query('DELETE FROM agendamento WHERE id_agendamento = $1 RETURNING *', [id]);
    if (rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ error: 'Appointment not found' });
      return;
    }
    
    await client.query('COMMIT');
    res.json({ message: 'Appointment deleted successfully', appointment: rows[0] });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};
