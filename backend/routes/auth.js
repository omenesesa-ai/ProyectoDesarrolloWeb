const express = require('express');
const router = express.Router();
const db = require('../database');
const errores = require('../errores');

// Ruta para Registrar Usuario
router.post('/registro', (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  const rolUsuario = rol || 'USUARIO'; 

  db.query('INSERT INTO Usuarios (nombre, correo, password_hash, rol) VALUES (?, ?, ?, ?)', 
    [nombre, correo, password, rolUsuario], 
    (err, result) => {
      if (err) {
        return res.status(errores.CORREO_DUPLICADO.status).json({ code: errores.CORREO_DUPLICADO.code, error: errores.CORREO_DUPLICADO.mensaje });
      }
      res.json({ mensaje: '¡Registro exitoso! Ya puedes iniciar sesión.' });
  });
});

// Ruta para Iniciar Sesión
router.post('/login', (req, res) => {
  const { correo, password } = req.body;
  
  db.query('SELECT * FROM Usuarios WHERE correo = ?', [correo], (err, resultados) => {
    if (err) return res.status(errores.DB_QUERY_ERROR.status).json({ code: errores.DB_QUERY_ERROR.code, error: errores.DB_QUERY_ERROR.mensaje });
    
    if (resultados.length === 0) return res.status(errores.USUARIO_NO_ENCONTRADO.status).json({ code: errores.USUARIO_NO_ENCONTRADO.code, error: errores.USUARIO_NO_ENCONTRADO.mensaje });

    const usuario = resultados[0];
    
    if (password !== usuario.password_hash) return res.status(errores.CONTRASENA_INCORRECTA.status).json({ code: errores.CONTRASENA_INCORRECTA.code, error: errores.CONTRASENA_INCORRECTA.mensaje });

    res.json({ id_usuario: usuario.id_usuario, nombre: usuario.nombre, rol: usuario.rol });
  });
});

module.exports = router;