import { z } from 'zod';

export const criarFuncionarioSchema = z.object({
  cpf: z.string().min(11, 'CPF deve ter pelo menos 11 caracteres').max(14, 'CPF deve ter no máximo 14 caracteres'),
  nome: z.string().min(1, 'Nome é obrigatório').max(100, 'Nome deve ter no máximo 100 caracteres'),
  cargo: z.enum(['Gerente', 'Atendente', 'Estoquista', 'Limpeza', 'Groomer'], {
    message: 'Cargo inválido. Escolha entre: Gerente, Atendente, Estoquista, Limpeza, Groomer'
  }),
  salario: z.number().positive('Salário deve ser maior que zero'),
});

export const atualizarFuncionarioSchema = criarFuncionarioSchema.partial();
