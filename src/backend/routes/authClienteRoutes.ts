import express from 'express';
import * as authClienteController from '../controllers/authClienteController';
import { validateBody } from '../middlewares/validate';
import { cadastroClienteSchema, loginClienteSchema, atualizarPerfilClienteSchema } from '../schemas/authClienteSchema';
import { autenticarCliente } from '../middlewares/authCliente';

const router = express.Router();

router.post('/cadastro', validateBody(cadastroClienteSchema), authClienteController.cadastro);
router.post('/login', validateBody(loginClienteSchema), authClienteController.login);
router.get('/me', autenticarCliente, authClienteController.me);
router.put('/me', autenticarCliente, validateBody(atualizarPerfilClienteSchema), authClienteController.atualizarPerfil);

export default router;