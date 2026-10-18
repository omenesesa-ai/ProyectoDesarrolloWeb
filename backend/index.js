const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 1. Importamos nuestras rutas modulares
const authRoutes = require('./routes/auth');
const eventosRoutes = require('./routes/eventos');
const inscripcionesRoutes = require('./routes/inscripciones');

const app = express();

// 2. Middlewares
app.use(cors());
app.use(express.json());

// 3. Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ mensaje: '¡El servidor está funcionando y modularizado!' });
});

// 4. Conectamos las rutas a la API
app.use('/api', authRoutes);
app.use('/api', eventosRoutes);
app.use('/api', inscripcionesRoutes);

// 5. Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});