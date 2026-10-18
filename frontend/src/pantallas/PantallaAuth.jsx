
import React, { useState } from 'react';

function PantallaAuth({ onLogin }) {
  const [esRegistro, setEsRegistro] = useState(false);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const [mensajeError, setMensajeError] = useState('');

  const manejarSubmit = async (e) => {
    e.preventDefault();
    setMensajeError(''); 

    // Aquí es donde llamamos a TU servidor real
    const rutaBackend = esRegistro 
      ? 'http://localhost:3000/api/registro' 
      : 'http://localhost:3000/api/login';
      
    const datosAEnviar = esRegistro 
      ? { nombre, correo, password } 
      : { correo, password };

    try {
      const respuesta = await fetch(rutaBackend, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAEnviar)
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(data.error || 'Error al conectar con el servidor');
      }

      if (esRegistro) {
        alert(data.mensaje);
        setEsRegistro(false);
        setPassword('');
        return;
      }

      // Le pasamos a App.jsx los datos REALES de tu base de datos
      onLogin(data); 

    } catch (error) {
      setMensajeError(error.message);
    }
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      
      <h2 style={{ color: '#1565C0' }}>
        {esRegistro ? 'Crear Nueva Cuenta' : 'Iniciar Sesión'}
      </h2>
      
      {mensajeError && <p style={{ color: 'red', fontWeight: 'bold' }}>{mensajeError}</p>}

      <form onSubmit={manejarSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        {esRegistro && (
          <input type="text" placeholder="Tu Nombre Completo" value={nombre} onChange={(e) => setNombre(e.target.value)} required style={{ padding: '10px' }} />
        )}
        <input type="email" placeholder="Correo electrónico" value={correo} onChange={(e) => setCorreo(e.target.value)} required style={{ padding: '10px' }} />
        <input type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: '10px' }} />
        
        <button type="submit" style={{ padding: '10px', background: '#1565C0', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          {esRegistro ? 'Registrarme' : 'Entrar al Sistema'}
        </button>
      </form>

      <button onClick={() => { setEsRegistro(!esRegistro); setMensajeError(''); }} style={{ marginTop: '20px', background: 'none', border: 'none', color: '#007BFF', cursor: 'pointer', textDecoration: 'underline' }}>
        {esRegistro ? '¿Ya tienes cuenta? Inicia sesión aquí' : '¿No tienes cuenta? Regístrate aquí'}
      </button>
    </div>
  );
}

export default PantallaAuth;
