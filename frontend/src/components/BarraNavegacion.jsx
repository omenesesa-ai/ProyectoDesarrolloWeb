import React from 'react';

function BarraNavegacion({ usuario, setUsuarioActual }) {
  const cerrarSesion = () => setUsuarioActual(null);

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px', background: '#333', color: 'white' }}>
      <h2>🎫 Sistema de Eventos</h2>
      <div>
        <span style={{ marginRight: '15px' }}>Hola, {usuario.nombre} ({usuario.rol})</span>
        <button onClick={cerrarSesion} style={{ padding: '5px 10px', cursor: 'pointer' }}>Cerrar Sesión</button>
      </div>
    </nav>
  );
}

export default BarraNavegacion;