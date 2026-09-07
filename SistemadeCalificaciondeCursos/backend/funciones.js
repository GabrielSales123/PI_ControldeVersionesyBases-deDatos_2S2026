// eslint-disable-next-line no-unused-vars
class validaciones {
  static validarCamposVacios ({ carnet, contrasena }) {
    if (typeof carnet !== 'string' || typeof contrasena !== 'string') {
      throw new Error('La contrasena o el carnet no son del tipo string')
    }
    if (carnet.length < 8) {
      throw new Error('El carnet no es valido')
    }
  }
};

module.exports = validaciones
