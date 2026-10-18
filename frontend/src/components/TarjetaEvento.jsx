import React from 'react';

function TarjetaEvento({ evento, onInscribir }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', margin: '10px', borderRadius: '8px', width: '250px' }}>
      <h3>{evento.nombre}</h3>
      <p><strong>Categoría:</strong> {evento.categoria}</p>
      <p><strong>Fecha:</strong> {evento.fecha_hora}</p>
      <p><strong>Lugar:</strong> {evento.lugar}</p>
      <p><strong>Precio:</strong> Q{evento.precio}</p>
      <p><strong>Cupos disponibles:</strong> {evento.cupos_disponibles}</p>
      <button 
        onClick={() => onInscribir(evento.id_evento)} 
        style={{ width: '100%', padding: '10px', cursor: 'pointer', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Inscribirse
      </button>
    </div>
  );
}

export default TarjetaEvento;