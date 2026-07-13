import express from 'express';
import * as areaLimpezaController from '../controllers/areaLimpezaController';
import { validateBody } from '../middlewares/validate';
import { atualizarAreaLimpezaSchema } from '../schemas/areaLimpezaSchema';
import { autenticarFuncionario } from '../middlewares/authFuncionario';

const router = express.Router();

router.get('/', autenticarFuncionario, areaLimpezaController.listarAreas);
router.patch('/:id', autenticarFuncionario, validateBody(atualizarAreaLimpezaSchema), areaLimpezaController.atualizarStatusArea);

export default router;
