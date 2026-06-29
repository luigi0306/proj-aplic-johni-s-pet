import express from 'express';
import * as prontuarioController from '../controllers/prontuarioController';
import { validateBody } from '../middlewares/validate';
import { criarProntuarioSchema, atualizarProntuarioSchema } from '../schemas/prontuarioSchema';

const router = express.Router();

router.get('/', prontuarioController.listarProntuarios);
router.get('/:id', prontuarioController.buscarProntuarioPorId);
router.post('/', validateBody(criarProntuarioSchema), prontuarioController.criarProntuario);
router.put('/:id', validateBody(atualizarProntuarioSchema), prontuarioController.atualizarProntuario);
router.delete('/:id', prontuarioController.deletarProntuario);

export default router;
