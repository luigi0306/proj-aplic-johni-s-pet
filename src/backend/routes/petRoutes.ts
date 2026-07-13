import express from 'express';
import * as petController from '../controllers/petController';
import { validateBody } from '../middlewares/validate';
import { criarPetSchema, atualizarPetSchema } from '../schemas/petSchema';
import { autenticarCliente } from '../middlewares/authCliente';

const router = express.Router();

const criarMeuPetSchema = criarPetSchema.omit({ id_cliente: true });

router.get('/busca', petController.pesquisarPetsPorNome);
router.get('/meus', autenticarCliente, petController.listarMeusPets);
router.post('/meus', autenticarCliente, validateBody(criarMeuPetSchema), petController.criarMeuPet);
router.get('/', petController.listarPets);
router.get('/:id', petController.buscarPetPorId);
router.post('/', validateBody(criarPetSchema), petController.criarPet);
router.put('/:id', validateBody(atualizarPetSchema), petController.atualizarPet);
router.delete('/:id', petController.deletarPet);

export default router;
