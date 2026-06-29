import { z } from 'zod';

export const criarProntuarioSchema = z.object({
  id_pet: z.number().int().positive('ID do pet inválido'),
  id_funcionario: z.number().int().positive('ID do funcionário inválido'),
  data_atendimento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de atendimento deve estar no formato YYYY-MM-DD').optional().nullable(),
  descricao: z.string().min(1, 'Descrição é obrigatória'),
});

export const atualizarProntuarioSchema = criarProntuarioSchema.partial();
