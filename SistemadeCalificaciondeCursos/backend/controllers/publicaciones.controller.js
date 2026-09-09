import { pool } from '../db.js';
import { validaciones } from '../funciones.js';

export const crearPublicacion = async (req, res) => {
  const { contenido } = req.body;
  const catedratico_id = req.body.catedratico_id || req.body.catedratico;
  const curso_id = req.body.curso_id || req.body.curso || null;

  if (!contenido || !catedratico_id) {
    return res.status(400).send("Contenido y catedrático son requeridos");
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

    try {
      if (curso_id) {
        await pool.query(
          'INSERT INTO publicaciones (contenido, catedratico_id, autor_id, curso_id) VALUES (?, ?, ?, ?)',
          [contenido, catedratico_id, usuario.id, curso_id]
        );
      } else {
        await pool.query(
          'INSERT INTO publicaciones (contenido, catedratico_id, autor_id) VALUES (?, ?, ?)',
          [contenido, catedratico_id, usuario.id]
        );
      }
    } catch (dbErr) {
      await pool.query(
        'INSERT INTO publicaciones (contenido, catedratico_id, autor_id) VALUES (?, ?, ?)',
        [contenido, catedratico_id, usuario.id]
      );
    }

    return res.status(201).send("Publicacion creada");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al crear publicacion");
  }
};

export const obtenerPublicaciones = async (req, res) => {
  try {
    // Si se envía token, se procesa opcionalmente sin bloquear la consulta del muro
    const token = req.cookies?.token;
    if (token) {
      try {
        validaciones.validarToken({ req, res });
      } catch (err) {
        // Continuar para permitir visualización de publicaciones
      }
    }

    const conditions = [];
    const params = [];

    // Filtro dinámico por Curso (id o coincidencia exacta)
    if (req.query.curso_id) {
      conditions.push('(cu.id = ?)');
      params.push(req.query.curso_id);
    } else if (req.query.curso) {
      if (!isNaN(req.query.curso)) {
        conditions.push('(cu.id = ?)');
        params.push(Number(req.query.curso));
      } else {
        conditions.push('(cu.nombre_curso LIKE ?)');
        params.push(`%${req.query.curso}%`);
      }
    }

    // Filtro dinámico por Catedrático (id o nombre)
    if (req.query.catedratico_id) {
      conditions.push('(cat.id = ?)');
      params.push(req.query.catedratico_id);
    } else if (req.query.catedratico) {
      if (!isNaN(req.query.catedratico)) {
        conditions.push('(cat.id = ?)');
        params.push(Number(req.query.catedratico));
      } else {
        conditions.push('(cat.nombres LIKE ? OR cat.apellidos LIKE ? OR CONCAT(cat.nombres, " ", cat.apellidos) LIKE ?)');
        params.push(`%${req.query.catedratico}%`, `%${req.query.catedratico}%`, `%${req.query.catedratico}%`);
      }
    }

    // Coincidencia de texto en Nombre de Curso
    if (req.query.buscar_curso) {
      conditions.push('(cu.nombre_curso LIKE ?)');
      params.push(`%${req.query.buscar_curso}%`);
    }

    // Coincidencia de texto en Nombre de Catedrático
    if (req.query.buscar_catedratico) {
      conditions.push('(cat.nombres LIKE ? OR cat.apellidos LIKE ? OR CONCAT(cat.nombres, " ", cat.apellidos) LIKE ?)');
      params.push(`%${req.query.buscar_catedratico}%`, `%${req.query.buscar_catedratico}%`, `%${req.query.buscar_catedratico}%`);
    }

    // Coincidencia general (q o buscar)
    const busquedaGeneral = req.query.q || req.query.buscar;
    if (busquedaGeneral) {
      conditions.push('(cu.nombre_curso LIKE ? OR cat.nombres LIKE ? OR cat.apellidos LIKE ? OR CONCAT(cat.nombres, " ", cat.apellidos) LIKE ? OR p.contenido LIKE ?)');
      params.push(`%${busquedaGeneral}%`, `%${busquedaGeneral}%`, `%${busquedaGeneral}%`, `%${busquedaGeneral}%`, `%${busquedaGeneral}%`);
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    let querySql = `
      SELECT p.*,
             u.nombres AS autor_nombres, u.apellidos AS autor_apellidos, u.carnet AS autor_carnet,
             cat.id AS catedratico_id, cat.nombres AS catedratico_nombres, cat.apellidos AS catedratico_apellidos,
             cu.id AS curso_id, cu.nombre_curso, cu.codigo_curso,
             (SELECT COUNT(*) FROM comentarios com WHERE com.publicacion_id = p.id) AS comentarios
      FROM publicaciones p
      INNER JOIN usuarios u ON p.autor_id = u.id
      INNER JOIN catedraticos cat ON p.catedratico_id = cat.id
      LEFT JOIN cursos cu ON (p.curso_id = cu.id OR (p.curso_id IS NULL AND cu.catedratico_id = cat.id))
      ${whereClause}
      ORDER BY p.fecha_publicacion DESC
    `;

    try {
      const [rows] = await pool.query(querySql, params);
      return res.status(200).json(rows);
    } catch (dbErr) {
      // Fallback si la columna curso_id no existe en la tabla fisica publicaciones
      const fallbackSql = `
        SELECT p.*,
               u.nombres AS autor_nombres, u.apellidos AS autor_apellidos, u.carnet AS autor_carnet,
               cat.id AS catedratico_id, cat.nombres AS catedratico_nombres, cat.apellidos AS catedratico_apellidos,
               cu.id AS curso_id, cu.nombre_curso, cu.codigo_curso,
               (SELECT COUNT(*) FROM comentarios com WHERE com.publicacion_id = p.id) AS comentarios
        FROM publicaciones p
        INNER JOIN usuarios u ON p.autor_id = u.id
        INNER JOIN catedraticos cat ON p.catedratico_id = cat.id
        LEFT JOIN cursos cu ON cu.catedratico_id = cat.id
        ${whereClause}
        ORDER BY p.fecha_publicacion DESC
      `;
      const [rows] = await pool.query(fallbackSql, params);
      return res.status(200).json(rows);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al obtener publicaciones");
  }
};

export const eliminarPublicacion = async (req, res) => {
  const { id } = req.params;
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

    const [postRows] = await pool.query('SELECT * FROM publicaciones WHERE id = ?', [id]);
    if (postRows.length === 0) {
      return res.status(404).send("Publicación no encontrada");
    }

    if (postRows[0].autor_id !== usuario.id) {
      return res.status(403).send("No tienes permiso para eliminar esta publicación");
    }

    await pool.query('DELETE FROM comentarios WHERE publicacion_id = ?', [id]);
    await pool.query('DELETE FROM publicaciones WHERE id = ?', [id]);
    return res.status(200).send("Publicación eliminada exitosamente");
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error al eliminar publicación");
  }
};