import express from 'express';
import * as petController from '../controllers/petController';
import { validateBody } from '../middlewares/validate';
import { criarPetSchema, atualizarPetSchema } from '../schemas/petSchema';

const router = express.Router();

router.get('/busca', petController.pesquisarPetsPorNome);
router.get('/', petController.listarPets);
router.get('/:id', petController.buscarPetPorId);
router.post('/', validateBody(criarPetSchema), petController.criarPet);
router.put('/:id', validateBody(atualizarPetSchema), petController.atualizarPet);
router.delete('/:id', petController.deletarPet);

export default router;
