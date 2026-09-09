import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { PORT } from './config.js';
import { pool } from './db.js';

import authRoutes from './routes/login_register.routes.js';
import perfilRoutes from './routes/perfil.route.js';
import aprobarRoutes from './routes/aprobar.routes.js';
import publicacionesRoutes from './routes/publicaciones.route.js';
import comentariosRoutes from './routes/comentarios.route.js';

const app = express();

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Rutas modulares
app.use('/api/auth', authRoutes);
app.use('/', authRoutes);
app.use('/', perfilRoutes);
app.use('/', aprobarRoutes);
app.use('/aprobar', aprobarRoutes);
app.use('/publicaciones', publicacionesRoutes);
app.use('/publicaciones/:id/comentarios', comentariosRoutes);
app.use('/comentarios', comentariosRoutes);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/catedraticos', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM catedraticos');
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener catedráticos");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});