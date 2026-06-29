import { z } from 'zod';

export const criarAnimalAdocaoSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  raca: z.string().max(40, 'Raça deve ter no máximo 40 caracteres').optional().nullable(),
  porte: z.enum(['Pequeno', 'Médio', 'Grande'], {
    message: 'Porte inválido. Escolha entre: Pequeno, Médio, Grande'
  }).optional().nullable(),
  faixa_etaria: z.enum(['Filhote', 'Adulto', 'Idoso'], {
    message: 'Faixa etária inválida. Escolha entre: Filhote, Adulto, Idoso'
  }).optional().nullable(),
  hist_medico: z.string().max(100, 'Histórico médico deve ter no máximo 100 caracteres').optional().nullable(),
  data_resgate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data de resgate deve estar no formato YYYY-MM-DD').optional().nullable(),
  status: z.enum(['Disponível', 'Em Tratamento', 'Adotado'], {
    message: 'Status inválido. Escolha entre: Disponível, Em Tratamento, Adotado'
  }).optional(),
  id_cliente_adotante: z.number().int().positive('ID do cliente adotante inválido').optional().nullable(),
});

export const atualizarAnimalAdocaoSchema = criarAnimalAdocaoSchema.partial();
