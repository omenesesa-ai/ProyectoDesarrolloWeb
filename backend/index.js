const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mysql = require('mysql2');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Configuración de la Base de Datos
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err.message);
  } else {
    console.log('¡Conectado a la base de datos MySQL!');
  }
});

// Ruta de prueba
app.get('/api/test', (req, res) => {
  res.json({ mensaje: '¡El servidor está funcionando!' });
});

// Ruta para Registrar Usuario (Texto plano, sin encriptar)
app.post('/api/registro', (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  const rolUsuario = rol || 'USUARIO'; 

  db.query('INSERT INTO Usuarios (nombre, correo, password_hash, rol) VALUES (?, ?, ?, ?)', 
    [nombre, correo, password, rolUsuario], 
    (err, result) => {
      if (err) return res.status(400).json({ error: 'El correo ya está registrado' });
      res.json({ mensaje: '¡Registro exitoso! Ya puedes iniciar sesión.' });
  });
});

// Ruta para Iniciar Sesión (Login con texto plano)
app.post('/api/login', (req, res) => {
  const { correo, password } = req.body;
  
  db.query('SELECT * FROM Usuarios WHERE correo = ?', [correo], (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error del servidor' });
    if (resultados.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const usuario = resultados[0];
    
    // Comparar la contraseña ingresada en texto plano
    if (password !== usuario.password_hash) {
      return res.status(401).json({ error: 'Contraseña incorrecta' });
    }

    res.json({ 
      id_usuario: usuario.id_usuario, 
      nombre: usuario.nombre, 
      rol: usuario.rol 
    });
  });
});

// Ruta para obtener el catálogo de eventos
app.get('/api/eventos', (req, res) => {
  const query = 'SELECT * FROM Eventos';
  
  db.query(query, (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error interno del servidor' });
    res.json(resultados); 
  });
});

// Ruta para procesar inscripciones con validaciones
app.post('/api/inscribirse', (req, res) => {
  const { id_usuario, id_evento } = req.body;

  db.query('SELECT fecha_hora, cupos_disponibles FROM Eventos WHERE id_evento = ?', [id_evento], (err, resultadosEvento) => {
    if (err) return res.status(500).json({ error: 'Error interno del servidor' });
    if (resultadosEvento.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });
    
    const eventoNuevo = resultadosEvento[0];

    if (eventoNuevo.cupos_disponibles <= 0) {
      return res.status(400).json({ error: 'El evento ya está lleno' });
    }

    const queryValidacion = `
      SELECT e.id_evento, e.fecha_hora 
      FROM Inscripciones i 
      JOIN Eventos e ON i.id_evento = e.id_evento 
      WHERE i.id_usuario = ? AND i.estado = 'ACTIVA'
    `;

    db.query(queryValidacion, [id_usuario], (err, inscripcionesActivas) => {
      if (err) return res.status(500).json({ error: 'Error al validar inscripciones' });

      const yaInscrito = inscripcionesActivas.find(inscripcion => inscripcion.id_evento === id_evento);
      if (yaInscrito) return res.status(400).json({ error: 'Ya estás inscrito en este evento' });

      const choqueHorario = inscripcionesActivas.find(inscripcion => 
        new Date(inscripcion.fecha_hora).getTime() === new Date(eventoNuevo.fecha_hora).getTime()
      );
      if (choqueHorario) return res.status(400).json({ error: 'Tienes otro evento programado exactamente para el mismo día y hora' });

      db.query('INSERT INTO Inscripciones (id_usuario, id_evento) VALUES (?, ?)', [id_usuario, id_evento], (err) => {
        if (err) return res.status(500).json({ error: 'Error al registrar la inscripción' });

        db.query('UPDATE Eventos SET cupos_disponibles = cupos_disponibles - 1 WHERE id_evento = ?', [id_evento], (err) => {
          if (err) return res.status(500).json({ error: 'Error al actualizar los cupos' });
          res.json({ mensaje: '¡Inscripción exitosa!' });
        });
      });
    });
  });
});

// Ruta para obtener el historial del usuario
app.get('/api/mis-inscripciones/:id_usuario', (req, res) => {
  const { id_usuario } = req.params;
  const query = `
    SELECT e.id_evento, e.nombre, e.fecha_hora, e.lugar, i.estado 
    FROM Inscripciones i
    JOIN Eventos e ON i.id_evento = e.id_evento
    WHERE i.id_usuario = ?
  `;
  
  db.query(query, [id_usuario], (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error al obtener el historial' });
    res.json(resultados);
  });
});

// Ruta para cancelar inscripción (Regla de las 24 horas)
app.post('/api/cancelar', (req, res) => {
  const { id_usuario, id_evento } = req.body;

  db.query('SELECT fecha_hora FROM Eventos WHERE id_evento = ?', [id_evento], (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error del servidor' });
    if (resultados.length === 0) return res.status(404).json({ error: 'Evento no encontrado' });

    const fechaEvento = new Date(resultados[0].fecha_hora);
    const fechaActual = new Date();
    const diferenciaHoras = (fechaEvento - fechaActual) / (1000 * 60 * 60);

    if (diferenciaHoras < 24) {
      return res.status(400).json({ error: 'No puedes cancelar con menos de 24 horas de anticipación' });
    }

    db.query("UPDATE Inscripciones SET estado = 'CANCELADA' WHERE id_usuario = ? AND id_evento = ? AND estado = 'ACTIVA'", [id_usuario, id_evento], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al cancelar' });
      if (result.affectedRows === 0) return res.status(400).json({ error: 'La inscripción ya estaba cancelada o no existe' });

      db.query('UPDATE Eventos SET cupos_disponibles = cupos_disponibles + 1 WHERE id_evento = ?', [id_evento], (err) => {
        if (err) return res.status(500).json({ error: 'Error al restaurar el cupo' });
        res.json({ mensaje: 'Inscripción cancelada. Se ha devuelto tu cupo.' });
      });
    });
  });
});

// Ruta para que el Admin cree un nuevo evento
app.post('/api/eventos', (req, res) => {
  const { nombre, descripcion, categoria, fecha_hora, lugar, precio, capacidad_total, imagen_url } = req.body;
  const cupos_disponibles = capacidad_total;

  const query = `
    INSERT INTO Eventos 
    (nombre, descripcion, categoria, fecha_hora, lugar, precio, capacidad_total, cupos_disponibles, imagen_url) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [nombre, descripcion, categoria, fecha_hora, lugar, precio, capacidad_total, cupos_disponibles, imagen_url], (err, result) => {
    if (err) return res.status(500).json({ error: 'Error al guardar el evento en la base de datos' });
    res.json({ mensaje: '¡Evento publicado con éxito!', id_evento: result.insertId });
  });
});

// Ruta para que el Admin vea quién está inscrito en un evento
app.get('/api/eventos/:id_evento/asistentes', (req, res) => {
  const { id_evento } = req.params;
  const query = `
    SELECT u.nombre, u.correo, i.fecha_inscripcion, i.estado
    FROM Inscripciones i
    JOIN Usuarios u ON i.id_usuario = u.id_usuario
    WHERE i.id_evento = ?
  `;

  db.query(query, [id_evento], (err, resultados) => {
    if (err) return res.status(500).json({ error: 'Error al consultar la lista de asistentes' });
    res.json(resultados);
  });
});

// Iniciar el servidor (Siempre al final)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});