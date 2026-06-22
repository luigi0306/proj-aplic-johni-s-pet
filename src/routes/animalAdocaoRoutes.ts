import express from 'express';
import * as animalAdocaoController from '../controllers/animalAdocaoController';

const router = express.Router();

router.get('/', animalAdocaoController.listarAnimais);
router.get('/:id', animalAdocaoController.buscarAnimalPorId);
router.post('/', animalAdocaoController.criarAnimal);
router.put('/:id', animalAdocaoController.atualizarAnimal);
router.delete('/:id', animalAdocaoController.deletarAnimal);

export default router;
