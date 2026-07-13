import { z } from 'zod';

export const loginFuncionarioSchema = z.object({
  email: z.string().email('Email inválido'),
  senha: z.string().min(1, 'Senha é obrigatória'),
});

// Usado pelo Gerente para criar login de um funcionário já cadastrado
export const criarLoginFuncionarioSchema = z.object({
  id_funcionario: z.number().int().positive('ID do funcionário inválido'),
  email: z.string().email('Email inválido'),
  senha: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});
