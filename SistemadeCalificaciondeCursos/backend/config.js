require('dotenv').config()

const {
  PORT = 3000,
  SALT_ROUNDS = 10,
  SECRET_JWT_KEY = 'secret_key-$10aldla;dla;-@*890_tlon_uqbar_orbis_tertius'
} = process.env

module.exports = { PORT, SALT_ROUNDS, SECRET_JWT_KEY }
