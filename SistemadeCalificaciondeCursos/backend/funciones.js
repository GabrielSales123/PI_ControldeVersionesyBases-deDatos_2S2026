// eslint-disable-next-line no-unused-vars
const jwt = require('jsonwebtoken')
const { SECRET_JWT_KEY } = require('./config')
class validaciones {
  static validarCamposVacios ({ carnet, contrasena }) {
    if (typeof carnet !== 'string' || typeof contrasena !== 'string') {
      throw new Error('La contrasena o el carnet no son del tipo string')
    }
    if (carnet.length < 8) {
      throw new Error('El carnet no es valido')
    }
  };

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
;
module.exports = validaciones
