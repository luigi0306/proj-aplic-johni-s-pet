import express from 'express';
import * as servicoController from '../controllers/servicoController';
import { validateBody } from '../middlewares/validate';
import { criarServicoSchema, atualizarServicoSchema } from '../schemas/servicoSchema';

const router = express.Router();

router.get('/', servicoController.listarServicos);
router.get('/:id', servicoController.buscarServicoPorId);
router.post('/', validateBody(criarServicoSchema), servicoController.criarServico);
router.put('/:id', validateBody(atualizarServicoSchema), servicoController.atualizarServico);
router.delete('/:id', servicoController.deletarServico);

export default router;
