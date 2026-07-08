import express from 'express';
import * as animalAdocaoController from '../controllers/animalAdocaoController';
import { validateBody, validateQuery } from '../middlewares/validate';
import { criarAnimalAdocaoSchema, atualizarAnimalAdocaoSchema, filtrarAnimaisAdocaoSchema } from '../schemas/animalAdocaoSchema';

const router = express.Router();

router.get('/', validateQuery(filtrarAnimaisAdocaoSchema), animalAdocaoController.listarAnimais);
router.get('/:id', animalAdocaoController.buscarAnimalPorId);
router.post('/', validateBody(criarAnimalAdocaoSchema), animalAdocaoController.criarAnimal);
router.put('/:id', validateBody(atualizarAnimalAdocaoSchema), animalAdocaoController.atualizarAnimal);
router.delete('/:id', animalAdocaoController.deletarAnimal);

export default router;
