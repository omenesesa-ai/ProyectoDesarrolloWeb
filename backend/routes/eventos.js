
const express = require('express');
const router = express.Router();
const db = require('../database');
const errores = require('../errores');

// Obtener el catalogo de eventos
router.get('/eventos', (req, res) => {
  db.query('SELECT * FROM Eventos', (err, resultados) => {
    if (err) {
      return res.status(errores.DB_QUERY_ERROR.status).json({
        code: errores.DB_QUERY_ERROR.code,
        error: errores.DB_QUERY_ERROR.mensaje
      });
    }

    res.json(resultados);
  });
});

// Crear un nuevo evento
router.post('/eventos', (req, res) => {
  const {
    nombre,
    descripcion,
    categoria,
    fecha_hora,
    lugar,
    precio,
    capacidad_total,
    imagen_url
  } = req.body;

  const query = `
    INSERT INTO Eventos
    (nombre, descripcion, categoria, fecha_hora, lugar,
     precio, capacidad_total, cupos_disponibles, imagen_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [
      nombre,
      descripcion,
      categoria,
      fecha_hora,
      lugar,
      precio,
      capacidad_total,
      capacidad_total,
      imagen_url
    ],
    (err, result) => {
      if (err) {
        console.error('Error al crear evento:', err);

        return res.status(errores.DB_QUERY_ERROR.status).json({
          code: errores.DB_QUERY_ERROR.code,
          error: errores.DB_QUERY_ERROR.mensaje
        });
      }

      res.json({
        mensaje: '¡Evento publicado con éxito!',
        id_evento: result.insertId
      });
    }
  );
});

// Modificar un evento existente
router.put('/eventos/:id_evento', (req, res) => {
  const { id_evento } = req.params;

  const {
    nombre,
    descripcion,
    categoria,
    fecha_hora,
    lugar,
    precio,
    capacidad_total,
    imagen_url
  } = req.body;

  // Validar datos principales
  const nuevaCapacidad = Number(capacidad_total);

  if (
    !nombre ||
    !fecha_hora ||
    !lugar ||
    !Number.isInteger(nuevaCapacidad) ||
    nuevaCapacidad < 1 ||
    precio === '' ||
    precio === null ||
    !Number.isFinite(Number(precio)) ||
    Number(precio) < 0
  ) {
    return res.status(400).json({
      error: 'Verifica los datos del evento.'
    });
  }

  // Consultar capacidad actual
  const consulta = `
    SELECT capacidad_total, cupos_disponibles
    FROM Eventos
    WHERE id_evento = ?
  `;

  db.query(consulta, [id_evento], (err, resultados) => {
    if (err) {
      console.error('Error al consultar evento:', err);

      return res.status(500).json({
        error: 'Error al consultar el evento.'
      });
    }

    if (resultados.length === 0) {
      return res.status(404).json({
        error: 'El evento no existe.'
      });
    }

    const eventoActual = resultados[0];

    // Calcular los cupos que ya estan ocupados
    const cuposOcupados =
      eventoActual.capacidad_total -
      eventoActual.cupos_disponibles;

    if (nuevaCapacidad < cuposOcupados) {
      return res.status(400).json({
        error:
          `No puedes reducir la capacidad a ${nuevaCapacidad}. ` +
          `Ya hay ${cuposOcupados} cupos ocupados.`
      });
    }

    const nuevosCupos = nuevaCapacidad - cuposOcupados;

    const query = `
      UPDATE Eventos
      SET nombre = ?,
          descripcion = ?,
          categoria = ?,
          fecha_hora = ?,
          lugar = ?,
          precio = ?,
          capacidad_total = ?,
          cupos_disponibles = ?,
          imagen_url = ?
      WHERE id_evento = ?
    `;

    db.query(
      query,
      [
        nombre,
        descripcion,
        categoria,
        fecha_hora,
        lugar,
        Number(precio),
        nuevaCapacidad,
        nuevosCupos,
        imagen_url,
        id_evento
      ],
      (error, resultado) => {
        if (error) {
          console.error('Error al modificar evento:', error);

          return res.status(500).json({
            error: 'No se pudo modificar el evento.'
          });
        }

        if (resultado.affectedRows === 0) {
          return res.status(404).json({
            error: 'Evento no encontrado.'
          });
        }

        res.json({
          mensaje: '¡Evento modificado correctamente!'
        });
      }
    );
  });
});

// Eliminar un evento
router.delete('/eventos/:id_evento', (req, res) => {
  const { id_evento } = req.params;

  // Revisar si tiene inscripciones relacionadas
  const consulta = `
    SELECT COUNT(*) AS total
    FROM Inscripciones
    WHERE id_evento = ?
  `;

  db.query(consulta, [id_evento], (err, resultados) => {
    if (err) {
      console.error('Error al revisar inscripciones:', err);

      return res.status(500).json({
        error: 'No se pudieron revisar las inscripciones.'
      });
    }

    if (resultados[0].total > 0) {
      return res.status(409).json({
        error:
          'Este evento tiene inscripciones registradas. ' +
          'No se puede eliminar para evitar perder información.'
      });
    }

    const query = 'DELETE FROM Eventos WHERE id_evento = ?';

    db.query(query, [id_evento], (error, resultado) => {
      if (error) {
        console.error('Error al eliminar evento:', error);

        return res.status(500).json({
          error: 'No se pudo eliminar el evento.'
        });
      }

      if (resultado.affectedRows === 0) {
        return res.status(404).json({
          error: 'El evento no existe.'
        });
      }

      res.json({
        mensaje: '¡Evento eliminado correctamente!'
      });
    });
  });
});

// Ver quienes estan inscritos en un evento
router.get('/eventos/:id_evento/asistentes', (req, res) => {
  const query = `
    SELECT
      u.nombre,
      u.correo,
      i.fecha_inscripcion,
      i.estado
    FROM Inscripciones i
    JOIN Usuarios u
      ON i.id_usuario = u.id_usuario
    WHERE i.id_evento = ?
  `;

  db.query(
    query,
    [req.params.id_evento],
    (err, resultados) => {
      if (err) {
        return res.status(errores.DB_QUERY_ERROR.status).json({
          code: errores.DB_QUERY_ERROR.code,
          error: errores.DB_QUERY_ERROR.mensaje
        });
      }

      res.json(resultados);
    }
  );
});

module.exports = router;
