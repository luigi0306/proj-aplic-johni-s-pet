import express from 'express';
import * as prontuarioController from '../controllers/prontuarioController';

const router = express.Router();

router.get('/', prontuarioController.listarProntuarios);
router.get('/:id', prontuarioController.buscarProntuarioPorId);
router.post('/', prontuarioController.criarProntuario);
router.put('/:id', prontuarioController.atualizarProntuario);
router.delete('/:id', prontuarioController.deletarProntuario);

export default router;
