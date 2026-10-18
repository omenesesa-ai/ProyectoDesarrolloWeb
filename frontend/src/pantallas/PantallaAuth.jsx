
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

      onLogin(data);

    } catch (error) {
      setMensajeError(error.message);
    }
  };

  const estiloInput = {
    padding: '14px 16px',
    borderRadius: '10px',
    border: '1px solid #d8e3ed',
    fontSize: '15px',
    outlineColor: '#8aafce',
    backgroundColor: '#f8fbfd',
    color: '#263b50',
    width: '100%',
    boxSizing: 'border-box'
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #eaf4fa, #d9e9f3, #edf5f8)',
      padding: '24px',
      boxSizing: 'border-box',
      fontFamily: 'Arial, sans-serif'
    }}>

      <div style={{
        backgroundColor: '#ffffff',
        padding: '42px 35px',
        borderRadius: '20px',
        boxShadow: '0 12px 35px rgba(49, 85, 117, 0.12)',
        width: '100%',
        maxWidth: '410px',
        textAlign: 'center',
        boxSizing: 'border-box'
      }}>

        <div style={{
          width: '65px',
          height: '65px',
          borderRadius: '18px',
          backgroundColor: '#e7f1f8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          fontSize: '30px'
        }}>
          🔐
        </div>

        <h2 style={{
          color: '#294d6b',
          marginBottom: '10px',
          fontSize: '27px'
        }}>
          {esRegistro ? 'Crear Nueva Cuenta' : 'Bienvenido'}
        </h2>

        <p style={{
          color: '#8193a3',
          fontSize: '14px',
          marginBottom: '30px'
        }}>
          {esRegistro
            ? 'Completa tus datos para registrarte'
            : 'Ingresa tus datos para continuar'}
        </p>

        {mensajeError && (
          <p style={{
            color: '#b84242',
            backgroundColor: '#fff0f0',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '14px'
          }}>
            {mensajeError}
          </p>
        )}

        <form onSubmit={manejarSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '17px',
          textAlign: 'left'
        }}>

          {esRegistro && (
            <div>
              <label style={{ color: '#526b80', fontSize: '13px' }}>
                Nombre completo
              </label>
              <input
                type="text"
                placeholder="Escribe tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
                style={{ ...estiloInput, marginTop: '7px' }}
              />
            </div>
          )}

          <div>
            <label style={{ color: '#526b80', fontSize: '13px' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="ejemplo@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
              style={{ ...estiloInput, marginTop: '7px' }}
            />
          </div>

          <div>
            <label style={{ color: '#526b80', fontSize: '13px' }}>
              Contraseña
            </label>
            <input
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ ...estiloInput, marginTop: '7px' }}
            />
          </div>

          <button type="submit" style={{
            padding: '15px',
            backgroundColor: '#638eaf',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '15px',
            fontWeight: 'bold',
            marginTop: '10px',
            boxShadow: '0 5px 12px rgba(99, 142, 175, 0.2)'
          }}>
            {esRegistro ? 'Crear mi cuenta' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{
          marginTop: '28px',
          borderTop: '1px solid #edf1f5',
          paddingTop: '20px'
        }}>
          <button
            onClick={() => {
              setEsRegistro(!esRegistro);
              setMensajeError('');
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#638eaf',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold'
            }}
          >
            {esRegistro
              ? '¿Ya tienes cuenta? Inicia sesión'
              : '¿No tienes cuenta? Regístrate aquí'}
          </button>
        </div>

      </div>
    </div>
  );
}

export default PantallaAuth;
