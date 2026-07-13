import express from 'express';
const router = express.Router();

// Import individual routers
import clienteRoutes from './clienteRoutes';
import petRoutes from './petRoutes';
import funcionarioRoutes from './funcionarioRoutes';
import servicoRoutes from './servicoRoutes';
import agendamentoRoutes from './agendamentoRoutes';
import produtoRoutes from './produtoRoutes';
import vendaRoutes from './vendaRoutes';
import insumoRoutes from './insumoRoutes';
import animalAdocaoRoutes from './animalAdocaoRoutes';
import prontuarioRoutes from './prontuarioRoutes';
import solicitacaoAdocaoRoutes from './solicitacaoAdocaoRoutes';

// Novas rotas — painel do funcionário
import authFuncionarioRoutes from './authFuncionarioRoutes';
import pedidoInsumoRoutes from './pedidoInsumoRoutes';
import areaLimpezaRoutes from './areaLimpezaRoutes';
import despesaRoutes from './despesaRoutes';
import relatorioRoutes from './relatorioRoutes';

// Autenticação e área do cliente
import authClienteRoutes from './authClienteRoutes';

// Map base paths to routers
router.use('/clientes', clienteRoutes);
router.use('/pets', petRoutes);
router.use('/funcionarios', funcionarioRoutes);
router.use('/servicos', servicoRoutes);
router.use('/agendamentos', agendamentoRoutes);
router.use('/produtos', produtoRoutes);
router.use('/vendas', vendaRoutes);
router.use('/insumos', insumoRoutes);
router.use('/animais-adocao', animalAdocaoRoutes);
router.use('/prontuarios', prontuarioRoutes);
router.use('/solicitacoes-adocao', solicitacaoAdocaoRoutes);

// Novas
router.use('/auth/funcionarios', authFuncionarioRoutes);
router.use('/pedidos-insumo', pedidoInsumoRoutes);
router.use('/areas-limpeza', areaLimpezaRoutes);
router.use('/despesas', despesaRoutes);
router.use('/relatorio', relatorioRoutes);
router.use('/auth/clientes', authClienteRoutes);

export default router;

