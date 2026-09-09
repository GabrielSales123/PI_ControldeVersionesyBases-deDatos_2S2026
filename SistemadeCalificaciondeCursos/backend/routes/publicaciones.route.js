import { Router } from 'express';
import { crearPublicacion, obtenerPublicaciones, eliminarPublicacion } from '../controllers/publicaciones.controller.js';

const router = Router();

router.post('/', crearPublicacion);
router.get('/', obtenerPublicaciones);
router.delete('/:id', eliminarPublicacion);

export default router;