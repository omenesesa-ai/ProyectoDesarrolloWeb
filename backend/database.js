// Archivo: backend/database.js
const mysql = require('mysql2');
require('dotenv').config();
const errores = require('./errores');

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error(errores.DB_CONNECTION_ERROR.mensaje, err.message);
  } else {
    console.log('¡Conectado a la base de datos MySQL!');
  }
});

module.exports = db;