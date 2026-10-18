import React from 'react';

function BarraNavegacion({ usuario, setUsuarioActual, setVistaActual }) {
  const cerrarSesion = () => {
    setUsuarioActual(null);
  };

  return (
    <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 30px', background: '#333', color: 'white' }}>
      <h2 style={{ margin: 0, color: '#ffeb3b' }}>🎫 Sistema de Eventos</h2>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <span style={{ fontSize: '16px' }}>
          Hola, <strong>{usuario.nombre}</strong> ({usuario.rol})
        </span>
        
        {/* Este botón solo aparece si eres usuario normal */}
        {usuario.rol !== 'ADMIN' && setVistaActual && (
          <button 
            onClick={() => setVistaActual('historial')} 
            style={{ padding: '8px 15px', cursor: 'pointer', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
          >
            Mis Eventos
          </button>
        )}
        
        <button 
          onClick={cerrarSesion} 
          style={{ padding: '8px 15px', cursor: 'pointer', background: '#dc3545', color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' }}
        >
          Cerrar Sesión
        </button>
      </div>
    </nav>
  );
}

export default BarraNavegacion;