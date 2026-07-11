import { z } from 'zod';

export const criarServicoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  preco_base: z.number().positive('Preço base deve ser maior que zero'),
});

export const atualizarServicoSchema = criarServicoSchema.partial();

export const filtrarServicosSchema = z.object({
  nome:      z.string().optional(),
  preco_min: z.preprocess(
    (v) => (v !== undefined && v !== '' ? parseFloat(v as string) : undefined),
    z.number().nonnegative('Preço mínimo não pode ser negativo')
  ).optional(),
  preco_max: z.preprocess(
    (v) => (v !== undefined && v !== '' ? parseFloat(v as string) : undefined),
    z.number().nonnegative('Preço máximo não pode ser negativo')
  ).optional(),
});
