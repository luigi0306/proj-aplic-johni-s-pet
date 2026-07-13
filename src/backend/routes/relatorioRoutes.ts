import express from 'express';
import * as relatorioController from '../controllers/relatorioController';
import { autenticarFuncionario, permitirCargos } from '../middlewares/authFuncionario';

const router = express.Router();

router.get('/', autenticarFuncionario, permitirCargos('Gerente'), relatorioController.gerarRelatorio);

export default router;
