import { Router } from 'express';
import { login, register, recuperarContrasena } from '../controllers/login_register.controller.js';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.post('/registro', register);
router.post('/recuperar_contrasena', recuperarContrasena);
router.post('/recuperar-contrasena', recuperarContrasena);
router.post('/forget', recuperarContrasena);

export default router;