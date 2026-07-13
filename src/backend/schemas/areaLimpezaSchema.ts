import { z } from 'zod';

export const atualizarAreaLimpezaSchema = z.object({
  status: z.enum(['Limpo', 'Pendente', 'Urgente'], { message: 'Status inválido.' }),
});
