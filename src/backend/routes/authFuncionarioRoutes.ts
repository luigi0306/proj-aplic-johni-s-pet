import express from 'express';
import * as authFuncionarioController from '../controllers/authFuncionarioController';
import { validateBody } from '../middlewares/validate';
import { loginFuncionarioSchema, criarLoginFuncionarioSchema } from '../schemas/authFuncionarioSchema';
import { autenticarFuncionario, permitirCargos } from '../middlewares/authFuncionario';

const router = express.Router();

router.post('/login', validateBody(loginFuncionarioSchema), authFuncionarioController.login);

// Só o Gerente pode criar login para outro funcionário (tela Equipe)
router.post(
  '/registrar',
  autenticarFuncionario,
  permitirCargos('Gerente'),
  validateBody(criarLoginFuncionarioSchema),
  authFuncionarioController.criarLogin
);

router.get('/me', autenticarFuncionario, authFuncionarioController.me);

export default router;
