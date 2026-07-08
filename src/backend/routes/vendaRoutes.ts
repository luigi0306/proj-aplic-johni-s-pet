import express from 'express';
import * as vendaController from '../controllers/vendaController';
import { validateBody } from '../middlewares/validate';
import { criarVendaSchema } from '../schemas/vendaSchema';

const router = express.Router();

router.get('/', vendaController.listarVendas);
router.get('/:id', vendaController.buscarVendaPorId);
router.post('/', validateBody(criarVendaSchema), vendaController.criarVenda);

export default router;
