import express from 'express';
import * as petController from '../controllers/petController';

const router = express.Router();

router.get('/', petController.listarPets);
router.get('/:id', petController.buscarPetPorId);
router.post('/', petController.criarPet);
router.put('/:id', petController.atualizarPet);
router.delete('/:id', petController.deletarPet);

export default router;
