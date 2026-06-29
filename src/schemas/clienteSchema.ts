import { z } from 'zod';

export const criarClienteSchema = z.object({
  cpf: z.string().min(11, 'CPF deve ter pelo menos 11 caracteres').max(14, 'CPF deve ter no máximo 14 caracteres'),
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  telefone: z.string().min(8, 'Telefone deve ter pelo menos 8 caracteres').max(15, 'Telefone deve ter no máximo 15 caracteres'),
  endereco: z.string().min(1, 'Endereço é obrigatório').max(100, 'Endereço deve ter no máximo 100 caracteres'),
});

export const atualizarClienteSchema = criarClienteSchema.partial();
