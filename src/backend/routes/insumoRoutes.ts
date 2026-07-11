import express from 'express';
import * as insumoController from '../controllers/insumoController';
import { validateBody } from '../middlewares/validate';
import { criarInsumoSchema, atualizarInsumoSchema, registrarUsoInsumoSchema } from '../schemas/insumoSchema';

const router = express.Router();

router.get('/', insumoController.listarInsumos);
router.get('/usos', insumoController.listarUsos);
router.get('/:id', insumoController.buscarInsumoPorId);
router.post('/', validateBody(criarInsumoSchema), insumoController.criarInsumo);
router.put('/:id', validateBody(atualizarInsumoSchema), insumoController.atualizarInsumo);
router.delete('/:id', insumoController.deletarInsumo);
router.post('/uso', validateBody(registrarUsoInsumoSchema), insumoController.registrarUso);

export default router;
