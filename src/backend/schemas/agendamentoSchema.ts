import { z } from 'zod';

export const criarAgendamentoSchema = z.object({
  id_pet: z.number().int().positive('ID do pet inválido'),
  id_funcionario: z.number().int().positive('ID do funcionário inválido').optional().nullable(),
  data_agendamento: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data do agendamento deve estar no formato YYYY-MM-DD'),
  hora: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Hora do agendamento deve estar no formato HH:MM ou HH:MM:SS'),
  status: z.enum(['Agendado', 'Confirmado', 'Concluído', 'Cancelado'], {
    message: 'Status inválido. Escolha entre: Agendado, Confirmado, Concluído, Cancelado'
  }).optional(),
  valor_total: z.number().nonnegative('Valor total deve ser maior ou igual a zero').optional().nullable(),
  servicos: z.array(
    z.object({
      id_servico: z.number().int().positive('ID do serviço inválido'),
      preco_cobrado: z.number().nonnegative('Preço cobrado deve ser maior ou igual a zero'),
    })
  ).optional().nullable(),
});

export const atualizarAgendamentoSchema = criarAgendamentoSchema.partial().omit({ servicos: true });
