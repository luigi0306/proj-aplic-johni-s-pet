import { z } from 'zod';

export const criarDespesaSchema = z.object({
  categoria: z.enum(['Salário', 'Insumos', 'Manutenção', 'Outros'], { message: 'Categoria inválida.' }),
  descricao: z.string().max(150).optional().nullable(),
  valor: z.number().positive('Valor deve ser maior que zero'),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data deve estar no formato YYYY-MM-DD').optional().nullable(),
});
