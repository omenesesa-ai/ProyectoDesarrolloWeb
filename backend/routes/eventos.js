const express = require('express');
const router = express.Router();
const db = require('../database');
const errores = require('../errores');

// Obtener el catálogo de eventos
router.get('/eventos', (req, res) => {
  db.query('SELECT * FROM Eventos', (err, resultados) => {
    if (err) return res.status(errores.DB_QUERY_ERROR.status).json({ code: errores.DB_QUERY_ERROR.code, error: errores.DB_QUERY_ERROR.mensaje });
    res.json(resultados); 
  });
});

// Crear un nuevo evento (Admin)
router.post('/eventos', (req, res) => {
  const { nombre, descripcion, categoria, fecha_hora, lugar, precio, capacidad_total, imagen_url } = req.body;
  const query = `INSERT INTO Eventos (nombre, descripcion, categoria, fecha_hora, lugar, precio, capacidad_total, cupos_disponibles, imagen_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.query(query, [nombre, descripcion, categoria, fecha_hora, lugar, precio, capacidad_total, capacidad_total, imagen_url], (err, result) => {
    if (err) return res.status(errores.DB_QUERY_ERROR.status).json({ code: errores.DB_QUERY_ERROR.code, error: errores.DB_QUERY_ERROR.mensaje });
    res.json({ mensaje: '¡Evento publicado con éxito!', id_evento: result.insertId });
  });
});

// Ver quién está inscrito en un evento (Admin)
router.get('/eventos/:id_evento/asistentes', (req, res) => {
  const query = `SELECT u.nombre, u.correo, i.fecha_inscripcion, i.estado FROM Inscripciones i JOIN Usuarios u ON i.id_usuario = u.id_usuario WHERE i.id_evento = ?`;
  db.query(query, [req.params.id_evento], (err, resultados) => {
    if (err) return res.status(errores.DB_QUERY_ERROR.status).json({ code: errores.DB_QUERY_ERROR.code, error: errores.DB_QUERY_ERROR.mensaje });
    res.json(resultados);
  });
});

module.exports = router;