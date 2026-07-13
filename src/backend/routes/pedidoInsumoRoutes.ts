import express from 'express';
import * as pedidoInsumoController from '../controllers/pedidoInsumoController';
import { validateBody } from '../middlewares/validate';
import { criarPedidoInsumoSchema, atualizarPedidoInsumoSchema } from '../schemas/pedidoInsumoSchema';
import { autenticarFuncionario } from '../middlewares/authFuncionario';

const router = express.Router();

router.get('/', autenticarFuncionario, pedidoInsumoController.listarPedidos);
router.post('/', autenticarFuncionario, validateBody(criarPedidoInsumoSchema), pedidoInsumoController.criarPedido);
router.patch('/:id', autenticarFuncionario, validateBody(atualizarPedidoInsumoSchema), pedidoInsumoController.atualizarStatusPedido);

export default router;
