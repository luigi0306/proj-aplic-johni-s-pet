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

export default router;
