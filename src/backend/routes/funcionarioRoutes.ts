import express from 'express';
import * as funcionarioController from '../controllers/funcionarioController';
import { validateBody } from '../middlewares/validate';
import { criarFuncionarioSchema, atualizarFuncionarioSchema } from '../schemas/funcionarioSchema';
import { autenticarFuncionario, permitirCargos } from '../middlewares/authFuncionario';

const router = express.Router();

router.get('/', funcionarioController.listarFuncionarios);
router.get('/:id', funcionarioController.buscarFuncionarioPorId);
router.post(
  '/',
  autenticarFuncionario,
  permitirCargos('Gerente'),
  validateBody(criarFuncionarioSchema),
  funcionarioController.criarFuncionario
);
router.put(
  '/:id',
  autenticarFuncionario,
  permitirCargos('Gerente'),
  validateBody(atualizarFuncionarioSchema),
  funcionarioController.atualizarFuncionario
);
router.delete(
  '/:id',
  autenticarFuncionario,
  permitirCargos('Gerente'),
  funcionarioController.deletarFuncionario
);

export default router;
