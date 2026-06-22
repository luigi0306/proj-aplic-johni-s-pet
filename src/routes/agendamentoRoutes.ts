import express from 'express';
import * as agendamentoController from '../controllers/agendamentoController';

const router = express.Router();

router.get('/', agendamentoController.listarAgendamentos);
router.get('/:id', agendamentoController.buscarAgendamentoPorId);
router.post('/', agendamentoController.criarAgendamento);
router.put('/:id', agendamentoController.atualizarAgendamento);
router.delete('/:id', agendamentoController.deletarAgendamento);

export default router;
