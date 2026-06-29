import { z } from 'zod';

export const criarPetSchema = z.object({
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  raca: z.string().max(40, 'Raça deve ter no máximo 40 caracteres').optional().nullable(),
  porte: z.enum(['Pequeno', 'Médio', 'Grande'], {
    message: 'Porte inválido. Escolha entre: Pequeno, Médio, Grande'
  }).optional().nullable(),
  faixa_etaria: z.enum(['Filhote', 'Adulto', 'Idoso'], {
    message: 'Faixa etária inválida. Escolha entre: Filhote, Adulto, Idoso'
  }).optional().nullable(),
  hist_medico: z.string().max(100, 'Histórico médico deve ter no máximo 100 caracteres').optional().nullable(),
  id_cliente: z.number().int().positive('ID do cliente inválido'),
});

export const atualizarPetSchema = criarPetSchema.partial();
