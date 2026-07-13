import express from 'express';
import * as despesaController from '../controllers/despesaController';
import { validateBody } from '../middlewares/validate';
import { criarDespesaSchema } from '../schemas/despesaSchema';
import { autenticarFuncionario, permitirCargos } from '../middlewares/authFuncionario';

const router = express.Router();

router.get('/', autenticarFuncionario, permitirCargos('Gerente'), despesaController.listarDespesas);
router.post('/', autenticarFuncionario, permitirCargos('Gerente'), validateBody(criarDespesaSchema), despesaController.criarDespesa);

export default router;
