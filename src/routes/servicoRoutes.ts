import express from 'express';
import * as servicoController from '../controllers/servicoController';
import { validateBody, validateQuery } from '../middlewares/validate';
import { criarServicoSchema, atualizarServicoSchema, filtrarServicosSchema } from '../schemas/servicoSchema';

const router = express.Router();

router.get('/', validateQuery(filtrarServicosSchema), servicoController.listarServicos);
router.get('/:id', servicoController.buscarServicoPorId);
router.post('/', validateBody(criarServicoSchema), servicoController.criarServico);
router.put('/:id', validateBody(atualizarServicoSchema), servicoController.atualizarServico);
router.delete('/:id', servicoController.deletarServico);

export default router;
