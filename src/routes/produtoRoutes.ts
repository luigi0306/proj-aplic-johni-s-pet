import express from 'express';
import * as produtoController from '../controllers/produtoController';
import { validateBody } from '../middlewares/validate';
import { criarProdutoSchema, atualizarProdutoSchema } from '../schemas/produtoSchema';

const router = express.Router();

router.get('/', produtoController.listarProdutos);
router.get('/:id', produtoController.buscarProdutoPorId);
router.post('/', validateBody(criarProdutoSchema), produtoController.criarProduto);
router.put('/:id', validateBody(atualizarProdutoSchema), produtoController.atualizarProduto);
router.delete('/:id', produtoController.deletarProduto);

export default router;
