import { z } from 'zod';

export const criarInsumoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(50, 'Nome deve ter no máximo 50 caracteres'),
  quantidade_estoque: z.number().int().nonnegative('Quantidade em estoque não pode ser negativa'),
});

export const atualizarInsumoSchema = criarInsumoSchema.partial();

export const registrarUsoInsumoSchema = z.object({
  id_insumo: z.number().int().positive('ID do insumo inválido'),
  quantidade_usada: z.number().int().positive('Quantidade usada deve ser maior que zero'),
  data_uso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de uso deve estar no formato YYYY-MM-DD').optional().nullable(),
});
