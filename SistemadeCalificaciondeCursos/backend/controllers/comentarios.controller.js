import { pool } from '../db.js';
import { validaciones } from '../funciones.js';

export const crearComentario = async (req, res) => {
  const publicacion_id = req.params.id || req.body.publicacion_id;
  const { contenido } = req.body;

  if (!contenido) {
    return res.status(400).send("El contenido es requerido");
  }

  try {
    const decoded = validaciones.validarToken({ req, res });
    if (!decoded) {
      return res.status(401).send("Token invalido o expirado");
    }
    const carnet = decoded.carnet;
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE carnet = ?', [carnet]);
    if (rows.length === 0) {
      return res.status(404).send("Usuario no encontrado");
    }
    const usuario = rows[0];

    await pool.query(
      'INSERT INTO comentarios (contenido, publicacion_id, id_usuario) VALUES (?, ?, ?)',
      [contenido, publicacion_id, usuario.id]
    );
    return res.status(201).send("Comentario creado");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear comentario");
  }
};

export const obtenerComentarios = async (req, res) => {
  const publicacion_id = req.params.id || req.params.comentario_id;
  try {
    const [rows] = await pool.query(`
      SELECT c.*, u.nombres AS autor_nombres, u.apellidos AS autor_apellidos, u.carnet AS autor_carnet
      FROM comentarios c
      INNER JOIN usuarios u ON c.id_usuario = u.id
      WHERE c.publicacion_id = ?
      ORDER BY c.fecha_comentario ASC
    `, [publicacion_id]);
    return res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener comentarios");
  }
};

export const eliminarComentario = async (req, res) => {
  const comentario_id = req.params.comentario_id || req.params.id;
  try {
    const decoded = validaciones.validarToken({ req, res });
    if (!decoded) {
      return res.status(401).send("Token invalido o expirado");
    }
    const carnet = decoded.carnet;
    const [userRows] = await pool.query('SELECT * FROM usuarios WHERE carnet = ?', [carnet]);
    if (userRows.length === 0) {
      return res.status(404).send("Usuario no encontrado");
    }
    const usuario = userRows[0];

    const [comentarioRows] = await pool.query('SELECT * FROM comentarios WHERE id = ?', [comentario_id]);
    if (comentarioRows.length === 0) {
      return res.status(404).send("Comentario no encontrado");
    }

    if (comentarioRows[0].id_usuario !== usuario.id) {
      return res.status(403).send("No tienes permiso para eliminar este comentario");
    }

    await pool.query('DELETE FROM comentarios WHERE id = ?', [comentario_id]);
    return res.status(200).send("Comentario eliminado exitosamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar comentario");
  }
};