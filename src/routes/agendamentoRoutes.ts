import express from 'express';
import * as agendamentoController from '../controllers/agendamentoController';
import { validateBody } from '../middlewares/validate';
import { criarAgendamentoSchema, atualizarAgendamentoSchema } from '../schemas/agendamentoSchema';

const router = express.Router();

router.get('/', agendamentoController.listarAgendamentos);
router.get('/:id', agendamentoController.buscarAgendamentoPorId);
router.post('/', validateBody(criarAgendamentoSchema), agendamentoController.criarAgendamento);
router.put('/:id', validateBody(atualizarAgendamentoSchema), agendamentoController.atualizarAgendamento);
router.delete('/:id', agendamentoController.deletarAgendamento);

export default router;
