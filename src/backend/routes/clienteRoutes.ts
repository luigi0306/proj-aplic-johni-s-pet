import express from 'express';
import * as clienteController from '../controllers/clienteController';
import { validateBody } from '../middlewares/validate';
import { criarClienteSchema, atualizarClienteSchema } from '../schemas/clienteSchema';

const router = express.Router();

router.get('/busca', clienteController.pesquisarClientesPorNome);
router.get('/', clienteController.listarClientes);
router.get('/:id', clienteController.buscarClientePorId);
router.post('/', validateBody(criarClienteSchema), clienteController.criarCliente);
router.put('/:id', validateBody(atualizarClienteSchema), clienteController.atualizarCliente);
router.delete('/:id', clienteController.deletarCliente);

export default router;
