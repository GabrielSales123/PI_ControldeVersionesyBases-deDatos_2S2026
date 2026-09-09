import jwt from 'jsonwebtoken';

import { pool } from '../db.js';
import bcrypt from 'bcrypt';
import { validaciones } from '../funciones.js';
import { SECRET_JWT_KEY, SALT_ROUNDS } from '../config.js';
export const login = async (req, res) => {
  const { carnet, contrasena } = req.body;

  if (!carnet || !contrasena) {
    return res.status(400).send("El carnet y la contraseña son requeridos");
  }

  try {
    validaciones.validarLogin({ carnet, contrasena });
    const token = jwt.sign({ carnet }, SECRET_JWT_KEY, { expiresIn: '1h' });
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE carnet = ?', [carnet]);
    if (rows.length === 0) {
      return res.status(401).send("Usuario no encontrado");
    }

    const usuario = rows[0];
    const passwordCorrecta = await bcrypt.compare(contrasena, usuario.contrasena);
    if (passwordCorrecta) {
      return res.status(200).cookie('token', token, { httpOnly: true, maxAge: 3600000 }).json({
        message: "Inicio de sesión exitoso",
        usuario: { nombres: usuario.nombres, apellidos: usuario.apellidos, carnet: usuario.carnet }
      });
    } else {
      return res.status(400).send("Credenciales invalidas");
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al iniciar sesión");
  }
};

export const register = async (req, res) => {
  const { nombres, apellidos, carnet, correo } = req.body;
  const pass = req.body.contrasena || req.body.pass;

  if (!nombres || !apellidos || !carnet || !pass || !correo) {
    return res.status(400).send("Todos los campos son requeridos: nombres, apellidos, carnet, contrasena, correo");
  }

  try {
    validaciones.validarCamposVacios({ carnet, contrasena: pass });

    const hashedPassword = await bcrypt.hash(pass, SALT_ROUNDS);
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE carnet = ?', [carnet]);
    if (rows.length > 0) {
      return res.status(400).send("El usuario ya existe");
    } else {  
        await pool.query(
          'INSERT INTO usuarios (nombres, apellidos, contrasena, carnet, correo) VALUES (?, ?, ?, ?, ?)',
          [nombres, apellidos, hashedPassword, carnet, correo]
        );
        return res.status(201).send("Usuario creado");
    } 
  }catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear usuario");
  }
};
export const recuperarContrasena = async (req, res) => {
  const { carnet } = req.body;
  const correo = req.body.correo || req.body.email;
  const nueva_contrasena = req.body.nueva_contrasena || req.body.contrasena || req.body.pass || req.body.nueva_clave;

  if (!carnet || !correo) {
    return res.status(400).send("El registro académico y el correo electrónico son requeridos");
  }

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE carnet = ?', [carnet]);
    if (rows.length === 0) {
      return res.status(400).send("Los datos proporcionados no coinciden con nuestros registros");
    }

    const usuario = rows[0];

    const correoUsuario = usuario.correo || usuario.email;
    if (!correoUsuario || correoUsuario.trim().toLowerCase() !== correo.trim().toLowerCase()) {
      return res.status(400).send("Los datos proporcionados no coinciden con nuestros registros");
    }

    if (nueva_contrasena) {
      if (typeof nueva_contrasena !== 'string' || nueva_contrasena.trim().length === 0) {
        return res.status(400).send("La nueva contraseña no puede estar vacía");
      }
      const hashedPassword = await bcrypt.hash(nueva_contrasena, SALT_ROUNDS);
      await pool.query('UPDATE usuarios SET contrasena = ? WHERE carnet = ?', [hashedPassword, carnet]);
      return res.status(200).send("Contraseña restablecida exitosamente");
    }

    return res.status(200).json({
      valido: true,
      message: "Datos verificados correctamente. Puede ingresar la nueva contraseña."
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al procesar la recuperación de contraseña");
  }
};




