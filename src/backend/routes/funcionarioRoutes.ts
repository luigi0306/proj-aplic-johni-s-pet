import express from 'express';
import * as funcionarioController from '../controllers/funcionarioController';
import { validateBody } from '../middlewares/validate';
import { criarFuncionarioSchema, atualizarFuncionarioSchema } from '../schemas/funcionarioSchema';

const router = express.Router();

router.get('/', funcionarioController.listarFuncionarios);
router.get('/:id', funcionarioController.buscarFuncionarioPorId);
router.post('/', validateBody(criarFuncionarioSchema), funcionarioController.criarFuncionario);
router.put('/:id', validateBody(atualizarFuncionarioSchema), funcionarioController.atualizarFuncionario);
router.delete('/:id', funcionarioController.deletarFuncionario);

export default router;
