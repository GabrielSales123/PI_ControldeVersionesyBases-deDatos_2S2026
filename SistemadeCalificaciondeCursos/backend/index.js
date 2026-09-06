const express = require('express');
const app = express();
const PORT = 8000;
const pool = require('./db');
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
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
  console.log(`datos obtenidos: ${nombres}, ${apellidos}, ${pass}, ${carnet}`)

  if (nombres && pass && apellidos && carnet){
    await pool.query('INSERT INTO usuarios (nombres, apellidos, contrasena, carnet) VALUES (?, ?, ?, ?)', [nombres, apellidos, pass, carnet]);
    res.status(201).send("Usuario creado")
  }
  
});

app.post('/login', async (req,res)=> {
  let nombres = req.body.nombres
  let pass = req.body.contrasena
  console.log(`datos obtenidos: ${nombres}, ${pass}`)

  if (nombres && pass){
    const [rows] = await pool.query('SELECT * FROM usuarios WHERE nombres = ? AND contrasena = ?', [nombres, pass]);
    if (rows.length > 0) {
      res.status(200).send("Login exitoso")
    } else {
      res.status(401).send("Credenciales inválidas")
    }
  }
  
});



app.get('/')