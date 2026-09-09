import { pool } from '../db.js';
import { validaciones } from '../funciones.js';

export const crearPublicacion = async (req, res) => {
  const { contenido } = req.body;
  const catedratico_id = req.body.catedratico_id || req.body.catedratico || null;
  const curso_id = req.body.curso_id || req.body.curso || null;

  if (!contenido || (typeof contenido === 'string' && contenido.trim().length === 0)) {
    return res.status(400).send("El contenido de la publicación es requerido");
  }

  if (!catedratico_id && !curso_id) {
    return res.status(400).send("Debe especificar al menos un curso o un catedrático");
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

    const catId = catedratico_id ? Number(catedratico_id) : null;
    const curId = curso_id ? Number(curso_id) : null;

    try {
      await pool.query(
        'INSERT INTO publicaciones (contenido, catedratico_id, curso_id, autor_id) VALUES (?, ?, ?, ?)',
        [contenido.trim(), catId, curId, usuario.id]
      );
    } catch (error) {
      if (error.code === 'ER_NO_SUCH_TABLE') {
        return res.status(500).send("La tabla de publicaciones no existe en la base de datos");
      } else if (error.code === 'ER_BAD_FIELD_ERROR') {
        if (!curId && catId) {
          await pool.query(
            'INSERT INTO publicaciones (contenido, catedratico_id, autor_id) VALUES (?, ?, ?)',
            [contenido.trim(), catId, usuario.id]
          );
        } else {
          throw error;
        }
      } else {
        throw error;
      }
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
      LEFT JOIN catedraticos cat ON p.catedratico_id = cat.id
      LEFT JOIN cursos cu ON p.curso_id = cu.id
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
        LEFT JOIN catedraticos cat ON p.catedratico_id = cat.id
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