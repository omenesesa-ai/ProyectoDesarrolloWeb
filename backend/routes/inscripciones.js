const express = require('express');
const router = express.Router();
const db = require('../database');
const errores = require('../errores');

// Obtener el historial del usuario
router.get('/mis-inscripciones/:id_usuario', (req, res) => {
  const query = `SELECT e.id_evento, e.nombre, e.fecha_hora, e.lugar, i.estado FROM Inscripciones i JOIN Eventos e ON i.id_evento = e.id_evento WHERE i.id_usuario = ?`;
  db.query(query, [req.params.id_usuario], (err, resultados) => {
    if (err) return res.status(errores.DB_QUERY_ERROR.status).json({ code: errores.DB_QUERY_ERROR.code, error: errores.DB_QUERY_ERROR.mensaje });
    res.json(resultados);
  });
});

// Inscribirse a un evento
router.post('/inscribirse', (req, res) => {
  const { id_usuario, id_evento } = req.body;

  db.query('SELECT fecha_hora, cupos_disponibles FROM Eventos WHERE id_evento = ?', [id_evento], (err, resultadosEvento) => {
    if (err) return res.status(errores.DB_QUERY_ERROR.status).json({ error: errores.DB_QUERY_ERROR.mensaje });
    if (resultadosEvento.length === 0) return res.status(errores.EVENTO_NO_ENCONTRADO.status).json({ error: errores.EVENTO_NO_ENCONTRADO.mensaje });
    
    if (resultadosEvento[0].cupos_disponibles <= 0) return res.status(errores.EVENTO_LLENO.status).json({ error: errores.EVENTO_LLENO.mensaje });

    db.query(`SELECT id_evento FROM Inscripciones WHERE id_usuario = ? AND estado = 'ACTIVA'`, [id_usuario], (err, activas) => {
      if (err) return res.status(errores.DB_QUERY_ERROR.status).json({ error: errores.DB_QUERY_ERROR.mensaje });
      if (activas.find(ins => ins.id_evento === id_evento)) return res.status(errores.YA_INSCRITO.status).json({ error: errores.YA_INSCRITO.mensaje });

      db.query('INSERT INTO Inscripciones (id_usuario, id_evento) VALUES (?, ?)', [id_usuario, id_evento], (err) => {
        if (err) return res.status(errores.DB_QUERY_ERROR.status).json({ error: errores.DB_QUERY_ERROR.mensaje });
        db.query('UPDATE Eventos SET cupos_disponibles = cupos_disponibles - 1 WHERE id_evento = ?', [id_evento], (err) => {
          if (err) return res.status(errores.DB_QUERY_ERROR.status).json({ error: errores.DB_QUERY_ERROR.mensaje });
          res.json({ mensaje: '¡Inscripción exitosa!' });
        });
      });
    });
  });
});

// Cancelar inscripción (Regla 24 hrs)
router.post('/cancelar', (req, res) => {
  const { id_usuario, id_evento } = req.body;

  db.query('SELECT fecha_hora FROM Eventos WHERE id_evento = ?', [id_evento], (err, resultados) => {
    if (err) return res.status(errores.DB_QUERY_ERROR.status).json({ error: errores.DB_QUERY_ERROR.mensaje });
    if (resultados.length === 0) return res.status(errores.EVENTO_NO_ENCONTRADO.status).json({ error: errores.EVENTO_NO_ENCONTRADO.mensaje });

    const diferenciaHoras = (new Date(resultados[0].fecha_hora) - new Date()) / (1000 * 60 * 60);
    if (diferenciaHoras < 24) return res.status(errores.CANCELACION_TEMPRANA.status).json({ error: errores.CANCELACION_TEMPRANA.mensaje });

    db.query("UPDATE Inscripciones SET estado = 'CANCELADA' WHERE id_usuario = ? AND id_evento = ? AND estado = 'ACTIVA'", [id_usuario, id_evento], (err, result) => {
      if (err) return res.status(errores.DB_QUERY_ERROR.status).json({ error: errores.DB_QUERY_ERROR.mensaje });
      if (result.affectedRows === 0) return res.status(errores.INSCRIPCION_NO_ACTIVA.status).json({ error: errores.INSCRIPCION_NO_ACTIVA.mensaje });

      db.query('UPDATE Eventos SET cupos_disponibles = cupos_disponibles + 1 WHERE id_evento = ?', [id_evento], (err) => {
        if (err) return res.status(errores.DB_QUERY_ERROR.status).json({ error: errores.DB_QUERY_ERROR.mensaje });
        res.json({ mensaje: 'Inscripción cancelada. Se ha devuelto tu cupo.' });
      });
    });
  });
});

module.exports = router;