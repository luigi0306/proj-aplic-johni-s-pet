import express from 'express';
import * as insumoController from '../controllers/insumoController';

const router = express.Router();

router.get('/', insumoController.listarInsumos);
router.get('/usos', insumoController.listarUsos);
router.get('/:id', insumoController.buscarInsumoPorId);
router.post('/', insumoController.criarInsumo);
router.put('/:id', insumoController.atualizarInsumo);
router.delete('/:id', insumoController.deletarInsumo);
router.post('/uso', insumoController.registrarUso);

export default router;
