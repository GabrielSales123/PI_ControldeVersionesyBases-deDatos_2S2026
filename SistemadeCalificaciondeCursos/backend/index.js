const express = require('express');
const app = express();

const pool = require('./db');
const bcrypt = require('bcrypt');
const validaciones = require('./funciones')
const jwt = require('jsonwebtoken');
const { PORT, SALT_ROUNDS, SECRET_JWT_KEY } = require('./config')
const cookieParser = require('cookie-parser');

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/catedraticos', async (req, res) => {
  const [rows] = await pool.query('SELECT * FROM catedraticos');
  res.send(rows);
});

app.post('/registro', async (req,res)=> {
  let nombres = req.body.nombres
  let pass = req.body.contrasena
  let apellidos = req.body.apellidos
  let carnet = req.body.carnet

  
  if (nombres && pass && apellidos && carnet)
    try {
      validaciones.validarCamposVacios({ carnet, contrasena: pass });
   
      const hashedPassword = await bcrypt.hash(pass, SALT_ROUNDS);
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE carnet = ?', [carnet]);
      if (rows.length > 0) {
        res.status(400).send("El usuario ya existe");
        return;
      }
      await pool.query('INSERT INTO usuarios (nombres, apellidos, contrasena, carnet) VALUES (?, ?, ?, ?)', [nombres, apellidos, hashedPassword, carnet]);
      res.status(201).send("Usuario creado")
    } catch (error) {
    console.error(error);
    res.status(500).send("Error al crear usuario");
  }

  
});

app.post('/login', async (req,res)=> {
  const {carnet, contrasena} = req.body;
  console.log(`datos obtenidos: ${carnet}, ${contrasena}`)

  if (carnet && contrasena){
    try {
      const token = jwt.sign({ carnet }, SECRET_JWT_KEY, { expiresIn: '1h' });
      const [rows] = await pool.query('SELECT * FROM usuarios WHERE carnet = ?', [carnet]);
      if (rows.length == 0) {
        res.status(401).send("Usuario no encontrado")
      } else{
          const usuario = rows[0]
          const passwordCorrecta = await bcrypt.compare(contrasena, usuario.contrasena)
          if (passwordCorrecta){
            res.status(200).cookie('token', token, { httpOnly: true, maxAge: 3600000 }).send(`Login exitoso bienvenido ${usuario.nombres} ${usuario.apellidos}`);
          }
          else {
            res.status(400).send("Credenciales invalidas")
          }
        }
    } catch (error) {
      console.error(error);
      res.status(500).send("Error al iniciar sesión");
    }
  }
  
});

app.get('/perfil', async (req, res) => {
  console.log(req.cookies)
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).send("No autorizado");
  }
  try {
    const decoded = jwt.verify(token, SECRET_JWT_KEY); 
    carnet = decoded.carnet;
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE carnet = ?', [carnet]);
    if (rows.length == 0) {
      res.status(404).send("Usuario no encontrado");
    } else {
      const usuario = rows[0];
      res.status(200).json({ nombres: usuario.nombres, apellidos: usuario.apellidos, carnet: usuario.carnet });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Error al obtener perfil");
  }
});


app.get('/')