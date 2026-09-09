import { pool } from '../db.js';
import { validaciones } from '../funciones.js';

export const aprobarCurso = async (req, res) => {
  const { curso_id } = req.body;
  if (curso_id) {
    try {
      const decoded = validaciones.validarToken({ req, res });
      if (!decoded) {
        res.status(401).send("Token invalido o expirado");
        return;
      }
      const carnet = decoded.carnet;
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE carnet = ?', [carnet]);
      if (rows.length == 0) {
        res.status(404).send("Usuario no encontrado");
        return;
      }
      const usuario = rows[0];

      const [cursoRows] = await pool.query('SELECT * FROM cursos WHERE id = ?', [curso_id]);
      if (cursoRows.length == 0) {
        res.status(404).send("Curso no encontrado en el pensum");
        return;
      }
      const curso = cursoRows[0];

      const [yaAprobado] = await pool.query('SELECT * FROM cursos_aprobados WHERE usuario_id = ? AND curso_id = ?', [usuario.id, curso_id]);
      if (yaAprobado.length > 0) {
        res.status(400).send("El curso ya está aprobado");
        return;
      }

      await pool.query('INSERT INTO cursos_aprobados (usuario_id, curso_id) VALUES (?, ?)', [usuario.id, curso_id]);

      const creditosCurso = Number(curso.creditos) || 0;
      await pool.query(
        'UPDATE usuarios SET cursos_aprobados = cursos_aprobados + 1, cantidad_creditos = cantidad_creditos + ? WHERE id = ?',
        [creditosCurso, usuario.id]
      );

      res.status(201).send("Curso aprobado agregado exitosamente");
    }
    catch (error) {
      console.error(error);
      res.status(500).send("Error al aprobar curso");
    }
  }
  else {
    res.status(400).send("ID de curso no proporcionado");
  }
};

export const eliminarCursoAprobado = async (req, res) => {
  const curso_id = req.body.curso_id || req.params.curso_id;
  if (curso_id) {
    try {
      const decoded = validaciones.validarToken({ req, res });
      if (!decoded) {
        res.status(401).send("Token invalido o expirado");
        return;
      }
      const carnet = decoded.carnet;
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE carnet = ?', [carnet]);
      if (rows.length == 0) {
        res.status(404).send("Usuario no encontrado");
        return;
      }
      const usuario = rows[0];

      const [aprobado] = await pool.query('SELECT * FROM cursos_aprobados WHERE usuario_id = ? AND curso_id = ?', [usuario.id, curso_id]);
      if (aprobado.length == 0) {
        res.status(404).send("El curso no se encuentra en el expediente de cursos aprobados");
        return;
      }

      const [cursoRows] = await pool.query('SELECT * FROM cursos WHERE id = ?', [curso_id]);
      const creditosCurso = (cursoRows.length > 0 && Number(cursoRows[0].creditos)) ? Number(cursoRows[0].creditos) : 0;

      await pool.query('DELETE FROM cursos_aprobados WHERE usuario_id = ? AND curso_id = ?', [usuario.id, curso_id]);

      await pool.query(
        'UPDATE usuarios SET cursos_aprobados = GREATEST(0, cursos_aprobados - 1), cantidad_creditos = GREATEST(0, cantidad_creditos - ?) WHERE id = ?',
        [creditosCurso, usuario.id]
      );

      res.status(200).send("Curso eliminado del expediente exitosamente");
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al eliminar curso aprobado");
    }
  } else {
    res.status(400).send("ID de curso no proporcionado");
  }
};