import express from 'express';
import * as solicitacaoAdocaoController from '../controllers/solicitacaoAdocaoController';
import { validateBody } from '../middlewares/validate';
import { criarSolicitacaoSchema, atualizarSolicitacaoSchema } from '../schemas/solicitacaoAdocaoSchema';

const router = express.Router();

router.get('/', solicitacaoAdocaoController.listarSolicitacoes);
router.post('/', validateBody(criarSolicitacaoSchema), solicitacaoAdocaoController.criarSolicitacao);
router.patch('/:id', validateBody(atualizarSolicitacaoSchema), solicitacaoAdocaoController.atualizarSolicitacao);

export default router;
