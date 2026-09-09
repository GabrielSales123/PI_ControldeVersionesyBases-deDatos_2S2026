import { Router } from 'express';
import { obtenerComentarios, crearComentario, eliminarComentario } from '../controllers/comentarios.controller.js';

const router = Router({ mergeParams: true });

router.get('/', obtenerComentarios);
router.get('/:comentario_id', obtenerComentarios);
router.post('/', crearComentario);
router.delete('/:comentario_id', eliminarComentario);

export default router;