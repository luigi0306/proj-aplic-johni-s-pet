import express from 'express';
import * as clienteController from '../controllers/clienteController';
import { validateBody } from '../middlewares/validate';
import { criarClienteSchema, atualizarClienteSchema } from '../schemas/clienteSchema';
import { autenticarFuncionario } from '../middlewares/authFuncionario';

const router = express.Router();

// ── Rotas do painel do funcionário ──────────────────────────────────────────
// GET /clientes/clientes-pets?q=termo  → busca clientes + pets aninhados
router.get('/clientes-pets', autenticarFuncionario, clienteController.buscarClientesComPets);

// POST /clientes/cadastro-completo  → cria cliente + usuário + pets em transação
router.post('/cadastro-completo', autenticarFuncionario, clienteController.cadastrarClienteCompleto);

// ── Rotas REST padrão ────────────────────────────────────────────────────────
router.get('/busca', clienteController.pesquisarClientesPorNome);
router.get('/', clienteController.listarClientes);
router.get('/:id', clienteController.buscarClientePorId);
router.post('/', validateBody(criarClienteSchema), clienteController.criarCliente);
router.put('/:id', validateBody(atualizarClienteSchema), clienteController.atualizarCliente);
router.delete('/:id', clienteController.deletarCliente);

export default router;
