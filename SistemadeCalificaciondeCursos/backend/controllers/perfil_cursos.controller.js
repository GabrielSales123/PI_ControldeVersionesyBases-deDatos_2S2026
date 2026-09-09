import { pool } from '../db.js';
import { validaciones } from '../funciones.js';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '../config.js';

export const mostrarPerfil = async (req, res) => {
  const token = req.cookies.token;

  const decoded = validaciones.validarToken({ req, res });
  console.log(`Decoded: ${decoded}`);
  if (!decoded) {
    res.status(401).send("Token invalido o expirado");
    return;
  }
  const carnet = decoded.carnet;
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE carnet = ?', [carnet]);
    if (rows.length == 0) {
      res.status(404).send("Usuario no encontrado");
      return;
    } 
    else {
      const usuario = rows[0];
      const [cursos] = await pool.query(
        'SELECT c.* FROM cursos c INNER JOIN cursos_aprobados ca ON c.id = ca.curso_id WHERE ca.usuario_id = ?',
        [usuario.id]
      );
      const totalCreditos = cursos.reduce((acc, c) => acc + (Number(c.creditos) || 0), 0) || usuario.cantidad_creditos || 0;
      res.status(200).json({
        id: usuario.id,
        nombres: usuario.nombres,
        apellidos: usuario.apellidos,
        carnet: usuario.carnet,
        es_propio: true,
        cursos_aprobados: cursos,
        total_creditos: totalCreditos,
        correo: usuario.correo
      });
      return;
    }
  }
  catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener perfil");
  }
};

export const editarPerfil = async (req, res) => {
  const decoded = validaciones.validarToken({ req, res });
  if (!decoded) {
    res.status(401).send("Token invalido o expirado");
    return;
  }
  const carnet = decoded.carnet;
  const { nombres, apellidos, contrasena } = req.body;

  if (!nombres || !apellidos) {
    res.status(400).send("Nombres o apellidos son requeridos");
    return;
  }

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE carnet = ?', [carnet]);
    if (rows.length == 0) {
      res.status(404).send("Usuario no encontrado");
      return;
    }

    if (contrasena) {
      const hashedPassword = await bcrypt.hash(contrasena, SALT_ROUNDS);
      await pool.query('UPDATE usuarios SET nombres = ?, apellidos = ?, contrasena = ? WHERE carnet = ?', [nombres, apellidos, hashedPassword, carnet]);
    } else {
      await pool.query('UPDATE usuarios SET nombres = ?, apellidos = ? WHERE carnet = ?', [nombres, apellidos, carnet]);
    }

    res.status(200).send("Perfil actualizado exitosamente");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al actualizar perfil");
  }
};

export const buscarPerfil = async (req, res) => {
  const carnetBuscado = req.params.carnet;
  const decoded = validaciones.validarToken({ req, res });

  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE carnet = ?', [carnetBuscado]);
    if (rows.length == 0) {
      res.status(404).send("Usuario no encontrado");
      return;
    }

    const usuario = rows[0];
    const [cursos] = await pool.query(
      'SELECT c.* FROM cursos c INNER JOIN cursos_aprobados ca ON c.id = ca.curso_id WHERE ca.usuario_id = ?',
      [usuario.id]
    );
    const totalCreditos = cursos.reduce((acc, c) => acc + (Number(c.creditos) || 0), 0) || usuario.cantidad_creditos || 0;
    const esPropio = decoded ? decoded.carnet === carnetBuscado : false;

    res.status(200).json({
      id: usuario.id,
      nombres: usuario.nombres,
      apellidos: usuario.apellidos,
      carnet: usuario.carnet,
      es_propio: esPropio,
      cursos_aprobados: cursos,
      total_creditos: totalCreditos
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al buscar perfil");
  }
};

export const obtenerCursos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM cursos');
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener cursos");
  }
};

export const obtenerCursosAprobados = async (req, res) => {
  const decoded = validaciones.validarToken({ req, res });
  if (!decoded) {
    res.status(401).send("Token invalido o expirado");
    return;
  }
  const carnet = decoded.carnet;
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE carnet = ?', [carnet]);
    if (rows.length == 0) {
      res.status(404).send("Usuario no encontrado");
      return;
    }
    const usuario = rows[0];
    const [cursos] = await pool.query(
      'SELECT c.* FROM cursos c INNER JOIN cursos_aprobados ca ON c.id = ca.curso_id WHERE ca.usuario_id = ?',
      [usuario.id]
    );
    const totalCreditos = cursos.reduce((acc, c) => acc + (Number(c.creditos) || 0), 0) || usuario.cantidad_creditos || 0;
    res.status(200).json({ cursos, total_creditos: totalCreditos });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener cursos aprobados");
  }
};

export const obtenerCursosAprobadosPorCarnet = async (req, res) => {
  const carnetBuscado = req.params.carnet;
  try {
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE carnet = ?', [carnetBuscado]);
    if (rows.length == 0) {
      res.status(404).send("Usuario no encontrado");
      return;
    }
    const usuario = rows[0];
    const [cursos] = await pool.query(
      'SELECT c.* FROM cursos c INNER JOIN cursos_aprobados ca ON c.id = ca.curso_id WHERE ca.usuario_id = ?',
      [usuario.id]
    );
    const totalCreditos = cursos.reduce((acc, c) => acc + (Number(c.creditos) || 0), 0) || usuario.cantidad_creditos || 0;
    res.status(200).json({ cursos, total_creditos: totalCreditos });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener cursos aprobados");
  }
};