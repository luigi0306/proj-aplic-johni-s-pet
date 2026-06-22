import express from 'express';
import * as funcionarioController from '../controllers/funcionarioController';

const router = express.Router();

router.get('/', funcionarioController.listarFuncionarios);
router.get('/:id', funcionarioController.buscarFuncionarioPorId);
router.post('/', funcionarioController.criarFuncionario);
router.put('/:id', funcionarioController.atualizarFuncionario);
router.delete('/:id', funcionarioController.deletarFuncionario);

export default router;
