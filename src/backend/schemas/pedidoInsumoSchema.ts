import { z } from 'zod';

export const criarPedidoInsumoSchema = z.object({
  id_insumo: z.number().int().positive('ID do insumo inválido'),
  quantidade: z.number().int().positive('Quantidade deve ser maior que zero'),
});

export const atualizarPedidoInsumoSchema = z.object({
  status: z.enum(['Pendente', 'Comprado'], { message: 'Status inválido.' }),
});
