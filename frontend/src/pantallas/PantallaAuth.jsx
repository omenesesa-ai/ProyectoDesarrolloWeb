import React, { useState } from 'react';

function PantallaAuth({ onLogin }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');

  const simularLogin = (e) => {
    e.preventDefault();
    // Simulación temporal: Si pones correo de admin, entras como admin. Si no, como usuario normal.
    const rolSimulado = correo.includes('admin') ? 'ADMIN' : 'USUARIO';
    
    onLogin({ 
      id_usuario: 1, 
      nombre: correo.split('@')[0], 
      rol: rolSimulado 
    });
  };

  return (
    <div style={{ padding: '50px', maxWidth: '400px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Iniciar Sesión</h2>
      <form onSubmit={simularLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="email" placeholder="Correo electrónico (pon 'admin@' para ver el panel de admin)" 
          value={correo} onChange={(e) => setCorreo(e.target.value)} required 
          style={{ padding: '10px' }}
        />
        <input 
          type="password" placeholder="Contraseña" 
          value={password} onChange={(e) => setPassword(e.target.value)} required 
          style={{ padding: '10px' }}
        />
        <button type="submit" style={{ padding: '10px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
          Entrar al Sistema
        </button>
      </form>
    </div>
  );
}

export default PantallaAuth;