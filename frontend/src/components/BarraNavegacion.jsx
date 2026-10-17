import React from 'react';

function BarraNavegacion({ usuario, vistaActual, setVistaActual, cerrarSesion }) {
  return (
    <nav style={{ padding: '20px', backgroundColor: '#222', color: 'white', marginBottom: '20px', display: 'flex', gap: '20px', alignItems: 'center' }}>
      <h2 style={{ margin: 0 }}>Eventos</h2>
      <button onClick={() => setVistaActual('catalogo')} style={{ padding: '10px', cursor: 'pointer', backgroundColor: vistaActual === 'catalogo' ? '#007bff' : '#444', color: 'white', border: 'none', borderRadius: '5px' }}>Catálogo</button>
      <button onClick={() => setVistaActual('historial')} style={{ padding: '10px', cursor: 'pointer', backgroundColor: vistaActual === 'historial' ? '#007bff' : '#444', color: 'white', border: 'none', borderRadius: '5px' }}>Mis Eventos</button>
      
      {usuario.rol === 'ADMIN' && (
        <button onClick={() => setVistaActual('admin')} style={{ padding: '10px', cursor: 'pointer', backgroundColor: vistaActual === 'admin' ? '#28a745' : '#444', color: 'white', border: 'none', borderRadius: '5px' }}>⚙️ Panel Admin</button>
      )}
      
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span>Hola, <strong>{usuario.nombre}</strong></span>
        <button onClick={cerrarSesion} style={{ padding: '8px', cursor: 'pointer', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '5px' }}>Salir</button>
      </div>
    </nav>
  );
}

export default BarraNavegacion;