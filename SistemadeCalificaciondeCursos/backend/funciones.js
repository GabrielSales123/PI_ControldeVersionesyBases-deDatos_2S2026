// eslint-disable-next-line no-unused-vars
import jwt from 'jsonwebtoken';
import { SECRET_JWT_KEY } from './config.js';
class validaciones {
  static validarLogin({ carnet, contrasena }) {
   
    if (!carnet || typeof carnet !== 'string' || !contrasena || typeof contrasena !== 'string') {
      throw new Error('El carnet y la contraseña son obligatorios y deben ser texto');
    }

    // 2. Limpiar espacios en blanco de los extremos
    const carnetLimpio = carnet.trim();
    const passLimpia = contrasena.trim();

    if (carnetLimpio === '' || passLimpia === '') {
      throw new Error('Los campos no pueden estar vacíos');
    }

    if (carnetLimpio.length < 8) {
      throw new Error('El carnet debe contener al menos 8 caracteres');
    }
  }


  static validarToken ({ req, res }) {
    const token = req.cookies.token
    if (!token) {
      return null
    }
    try {
      const decoded = jwt.verify(token, SECRET_JWT_KEY)
      return decoded
    } catch (error) {
      console.error('Error al verificar el token:', error)
      return null
    }
  };
}
; export { validaciones }