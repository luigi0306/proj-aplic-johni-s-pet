import express from 'express';
import * as vendaController from '../controllers/vendaController';

const router = express.Router();

router.get('/', vendaController.listarVendas);
router.get('/:id', vendaController.buscarVendaPorId);
router.post('/', vendaController.criarVenda);

export default router;
