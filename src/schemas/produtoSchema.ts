import { z } from 'zod';

export const criarProdutoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  preco: z.number().positive('Preço deve ser maior que zero'),
  categoria: z.string().max(20, 'Categoria deve ter no máximo 20 caracteres').optional().nullable(),
  estoque_atual: z.number().int().nonnegative('Estoque atual não pode ser negativo').optional(),
});

export const atualizarProdutoSchema = criarProdutoSchema.partial();
