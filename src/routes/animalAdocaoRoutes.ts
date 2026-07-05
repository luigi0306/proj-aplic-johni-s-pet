import express from 'express';
import * as animalAdocaoController from '../controllers/animalAdocaoController';
import { validateBody } from '../middlewares/validate';
import { criarAnimalAdocaoSchema, atualizarAnimalAdocaoSchema } from '../schemas/animalAdocaoSchema';

const router = express.Router();

router.get('/', animalAdocaoController.listarAnimais);
router.get('/:id', animalAdocaoController.buscarAnimalPorId);
router.post('/', validateBody(criarAnimalAdocaoSchema), animalAdocaoController.criarAnimal);
router.put('/:id', validateBody(atualizarAnimalAdocaoSchema), animalAdocaoController.atualizarAnimal);
router.delete('/:id', animalAdocaoController.deletarAnimal);

export default router;
