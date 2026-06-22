import express from 'express';
import * as servicoController from '../controllers/servicoController';

const router = express.Router();

router.get('/', servicoController.listarServicos);
router.get('/:id', servicoController.buscarServicoPorId);
router.post('/', servicoController.criarServico);
router.put('/:id', servicoController.atualizarServico);
router.delete('/:id', servicoController.deletarServico);

export default router;
