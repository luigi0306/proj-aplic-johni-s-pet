import { z } from 'zod';

export const criarVendaSchema = z.object({
  data_venda: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data da venda deve estar no formato YYYY-MM-DD').optional().nullable(),
  metodo_pagamento: z.enum(['Dinheiro', 'PIX', 'Crédito', 'Débito'], {
    message: 'Método de pagamento inválido. Escolha entre: Dinheiro, PIX, Crédito, Débito'
  }),
  valor_total: z.number().positive('Valor total deve ser maior que zero'),
  produtos: z.array(
    z.object({
      id_produto: z.number().int().positive('ID do produto inválido'),
      quantidade: z.number().int().positive('Quantidade deve ser pelo menos 1'),
    })
  ).min(1, 'Pelo menos um produto deve ser informado para realizar a venda'),
});
