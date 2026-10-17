// Catálogo centralizado de errores del sistema
module.exports = {
  // Errores de Base de Datos y Conexión (500)
  DB_CONNECTION_ERROR: {
    code: 5001,
    mensaje: 'Error crítico de conexión con la base de datos.',
    status: 500
  },
  DB_QUERY_ERROR: {
    code: 5002,
    mensaje: 'Error interno al procesar la consulta en la base de datos.',
    status: 500
  },

  // Errores de Autenticación y Usuarios (400 / 401 / 404)
  CORREO_DUPLICADO: {
    code: 4001,
    mensaje: 'El correo electrónico ya se encuentra registrado.',
    status: 400
  },
  USUARIO_NO_ENCONTRADO: {
    code: 4041,
    mensaje: 'El usuario no fue encontrado en el sistema.',
    status: 404
  },
  CONTRASENA_INCORRECTA: {
    code: 4011,
    mensaje: 'La contraseña ingresada es incorrecta.',
    status: 401
  },

  // Errores de Eventos (404)
  EVENTO_NO_ENCONTRADO: {
    code: 4042,
    mensaje: 'El evento especificado no existe.',
    status: 404
  },

  // Errores de Inscripciones y Reglas de Negocio (400)
  EVENTO_LLENO: {
    code: 4002,
    mensaje: 'El evento seleccionado ya no cuenta con cupos disponibles.',
    status: 400
  },
  YA_INSCRITO: {
    code: 4003,
    mensaje: 'Ya estás inscrito en este evento.',
    status: 400
  },
  CHOQUE_HORARIO: {
    code: 4004,
    mensaje: 'Tienes otro evento programado exactamente para el mismo día y hora.',
    status: 400
  },

  // Errores de Cancelación (400)
  CANCELACION_TEMPRANA: {
    code: 4005,
    mensaje: 'No puedes cancelar con menos de 24 horas de anticipación.',
    status: 400
  },
  INSCRIPCION_NO_ACTIVA: {
    code: 4006,
    mensaje: 'La inscripción ya estaba cancelada o no existe.',
    status: 400
  }
};