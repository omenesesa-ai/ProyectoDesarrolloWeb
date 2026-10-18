import React from 'react';

function TarjetaEvento({ evento, onInscribir, yaInscrito }) {
  const fechaFormateada = new Date(evento.fecha_hora).toLocaleString();

  // Lógica para decidir el color y texto del botón
  let textoBoton = 'Inscribirse';
  let colorBoton = '#007BFF'; // Azul por defecto
  let deshabilitado = false;

  if (yaInscrito) {
    textoBoton = 'Ya Inscrito ';
    colorBoton = '#28a745'; // Verde
    deshabilitado = true;
  } else if (evento.cupos_disponibles <= 0) {
    textoBoton = 'Agotado ';
    colorBoton = '#ccc'; // Gris
    deshabilitado = true;
  }

  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', margin: '10px', borderRadius: '8px', width: '280px', backgroundColor: '#fff', color: '#333', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
      {evento.imagen_url && (
        <img src={evento.imagen_url} alt={evento.nombre} style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '4px', marginBottom: '10px' }} />
      )}
      
      <h3 style={{ margin: '0 0 10px 0', color: '#007BFF' }}>{evento.nombre}</h3>
      <p style={{ margin: '5px 0' }}><strong>Categoría:</strong> {evento.categoria}</p>
      <p style={{ margin: '5px 0' }}><strong>Fecha:</strong> {fechaFormateada}</p>
      <p style={{ margin: '5px 0' }}><strong>Lugar:</strong> {evento.lugar}</p>
      <p style={{ margin: '5px 0' }}><strong>Precio:</strong> Q{evento.precio}</p>
      <p style={{ margin: '5px 0', color: evento.cupos_disponibles > 0 ? 'green' : 'red' }}>
        <strong>Cupos:</strong> {evento.cupos_disponibles > 0 ? evento.cupos_disponibles : 'AGOTADO'}
      </p>
      
      <button 
        onClick={() => onInscribir(evento.id_evento)} 
        disabled={deshabilitado}
        style={{ 
          width: '100%', padding: '10px', marginTop: '15px', cursor: deshabilitado ? 'not-allowed' : 'pointer', 
          background: colorBoton, color: 'white', border: 'none', borderRadius: '4px', fontWeight: 'bold' 
        }}
      >
        {textoBoton}
      </button>
    </div>
  );
}

export default TarjetaEvento;