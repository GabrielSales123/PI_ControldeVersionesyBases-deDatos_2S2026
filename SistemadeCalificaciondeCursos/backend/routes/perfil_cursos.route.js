import { Router } from 'express';
import {
  mostrarPerfil,
  editarPerfil,
  buscarPerfil,
  obtenerCursos,
  obtenerCursosAprobados,
  obtenerCursosAprobadosPorCarnet
} from '../controllers/perfil_cursos.controller.js';

const router = Router();

router.get('/perfil', mostrarPerfil);
router.put('/perfil', editarPerfil);
router.post('/editar_perfil', editarPerfil);
router.get('/perfil/:carnet', buscarPerfil);
router.get('/buscar_usuario/:carnet', buscarPerfil);
router.get('/cursos', obtenerCursos);
router.get('/cursos_aprobados', obtenerCursosAprobados);
router.get('/cursos_aprobados/:carnet', obtenerCursosAprobadosPorCarnet);

export default router;
