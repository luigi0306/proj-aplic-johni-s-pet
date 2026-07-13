import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import * as db from '../config/db';
import { AppError } from '../errors/AppError';

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
      throw new AppError('Cliente não encontrado.', 404);
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
      throw new AppError('Nenhum campo para atualização foi enviado.', 400);
    }
    const queryText = `
      UPDATE cliente
      SET ${fields.join(', ')}
      WHERE id_cliente = $${fields.length + 1}
      RETURNING *
    `;
    const { rows } = await db.query(queryText, [...Object.values(updates), id]);
    if (rows.length === 0) {
      throw new AppError('Cliente não encontrado.', 404);
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
      throw new AppError('Cliente não encontrado.', 404);
    }
    res.json({ message: 'Client deleted successfully', client: rows[0] });
  } catch (error) {
    next(error);
  }
};

export const pesquisarClientesPorNome = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { nome } = req.query;
  if (!nome || typeof nome !== 'string' || nome.trim() === '') {
    throw new AppError('Query param "nome" é obrigatório.', 400);
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

/**
 * Cadastro completo pelo funcionário:
 * cria cliente + usuário (login) + pets em uma única transação.
 * Body: { cpf, nome, telefone, endereco, email, senha, pets: [{nome, raca, porte, faixa_etaria, hist_medico}] }
 */
export const cadastrarClienteCompleto = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { cpf, nome, telefone, endereco, email, senha, pets } = req.body;
  const client = await db.pool.connect();
  try {
    await client.query('BEGIN');

    // 1. Inserir cliente
    const clienteResult = await client.query(
      `INSERT INTO cliente (cpf, nome, telefone, endereco)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [cpf, nome, telefone, endereco]
    );
    const novoCliente = clienteResult.rows[0];

    // 2. Criar login do cliente (usuário)
    const senhaHash = await bcrypt.hash(senha, 10);
    await client.query(
      `INSERT INTO usuario (id_cliente, email, senha_hash)
       VALUES ($1, $2, $3)`,
      [novoCliente.id_cliente, email, senhaHash]
    );

    // 3. Inserir pets (opcional)
    const petsInseridos: any[] = [];
    if (Array.isArray(pets)) {
      for (const pet of pets) {
        if (!pet.nome) continue;
        const petResult = await client.query(
          `INSERT INTO pet (nome, raca, porte, faixa_etaria, hist_medico, id_cliente)
           VALUES ($1, $2, $3, $4, $5, $6)
           RETURNING *`,
          [
            pet.nome,
            pet.raca || null,
            pet.porte || null,
            pet.faixa_etaria || null,
            pet.hist_medico || null,
            novoCliente.id_cliente,
          ]
        );
        petsInseridos.push(petResult.rows[0]);
      }
    }

    await client.query('COMMIT');

    res.status(201).json({ ...novoCliente, email, pets: petsInseridos });
  } catch (error) {
    await client.query('ROLLBACK');
    next(error);
  } finally {
    client.release();
  }
};

/**
 * Busca clientes com seus pets aninhados.
 * Query param: ?q=termo  (busca em nome do cliente, CPF e nome do pet)
 * Sem ?q retorna todos os clientes com pets.
 */
export const buscarClientesComPets = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { q } = req.query;
  try {
    let clienteRows: any[];

    if (q && typeof q === 'string' && q.trim() !== '') {
      const termo = `%${q.trim()}%`;
      const result = await db.query(
        `SELECT DISTINCT c.*, u.email
         FROM cliente c
         LEFT JOIN usuario u ON u.id_cliente = c.id_cliente
         LEFT JOIN pet p ON p.id_cliente = c.id_cliente
         WHERE c.nome ILIKE $1
            OR c.cpf ILIKE $1
            OR p.nome ILIKE $1
         ORDER BY c.nome ASC`,
        [termo]
      );
      clienteRows = result.rows;
    } else {
      const result = await db.query(
        `SELECT c.*, u.email
         FROM cliente c
         LEFT JOIN usuario u ON u.id_cliente = c.id_cliente
         ORDER BY c.id_cliente DESC`
      );
      clienteRows = result.rows;
    }

    // Para cada cliente, busca os pets
    const clientesComPets = await Promise.all(
      clienteRows.map(async (c: any) => {
        const petsResult = await db.query(
          `SELECT * FROM pet WHERE id_cliente = $1 ORDER BY id_pet ASC`,
          [c.id_cliente]
        );
        return { ...c, pets: petsResult.rows };
      })
    );

    res.json(clientesComPets);
  } catch (error) {
    next(error);
  }
};
