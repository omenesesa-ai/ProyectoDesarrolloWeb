import React from 'react';

function TarjetaEvento({ evento, manejarInscripcion }) {
  return (
    <div style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', width: '300px' }}>
      <img 
        src={evento.imagen_url} 
        alt={evento.nombre} 
        style={{ width: '100%', borderRadius: '4px', height: '200px', objectFit: 'cover' }} 
      />
      <h2>{evento.nombre}</h2>
      <p>{evento.descripcion}</p>
      <p><strong>Fecha:</strong> {new Date(evento.fecha_hora).toLocaleString()}</p>
      <p><strong>Lugar:</strong> {evento.lugar}</p>
      <p><strong>Precio:</strong> Q{evento.precio}</p>
      <p><strong>Cupos:</strong> {evento.cupos_disponibles} disponibles</p>
      
      <button 
        onClick={() => manejarInscripcion(evento.id_evento)}
        disabled={evento.cupos_disponibles === 0}
        style={{ 
          backgroundColor: evento.cupos_disponibles > 0 ? '#007bff' : '#ccc', 
          color: 'white', 
          padding: '10px', 
          border: 'none', 
          width: '100%', 
          cursor: 'pointer', 
          borderRadius: '5px' 
        }}
      >
        {evento.cupos_disponibles > 0 ? 'Inscribirse' : 'Agotado'}
      </button>
    </div>
  );
}

export default TarjetaEvento;