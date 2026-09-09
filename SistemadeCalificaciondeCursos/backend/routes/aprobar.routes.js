import { Router } from 'express';
import { aprobarCurso, eliminarCursoAprobado } from '../controllers/aprobar.controller.js';

const router = Router();

router.post('/aprobar_curso', aprobarCurso);
router.post('/aprobar', aprobarCurso);
router.delete('/eliminar/:curso_id', eliminarCursoAprobado);
router.delete('/eliminar_curso_aprobado', eliminarCursoAprobado);
router.post('/eliminar_curso_aprobado', eliminarCursoAprobado);
router.delete('/cursos_aprobados/:curso_id', eliminarCursoAprobado);
router.post('/desaprobar_curso', eliminarCursoAprobado);

export default router;