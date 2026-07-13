import { z } from 'zod';

export const criarSolicitacaoSchema = z.object({
  id_animal_adocao: z.number().int().positive('ID do animal inválido').optional().nullable(),
  nome_animal: z.string().optional().nullable(),
  id_cliente: z.number().int().positive('ID do cliente inválido').optional().nullable(),
  nome_solicitante: z.string().min(1, 'Nome do solicitante é obrigatório').max(100),
  telefone: z.string().min(1, 'Telefone é obrigatório').max(15),
  email: z.string().email('Email inválido').max(100),
  idade_solicitante: z.number().int().min(18, 'O solicitante deve ter pelo menos 18 anos'),
  tipo_moradia: z.enum(['Casa com quintal', 'Casa sem quintal', 'Apartamento com tela', 'Apartamento sem tela'], {
    message: 'Tipo de moradia inválido.'
  }),
});

export const atualizarSolicitacaoSchema = z.object({
  status: z.enum(['Pendente', 'Em Análise', 'Aprovada', 'Recusada', 'pendente', 'aprovada', 'recusada'], {
    message: 'Status inválido.'
  })
});
