import React, { useState } from 'react';
import BarraNavegacion from '../components/BarraNavegacion';
import PanelFiltros from '../components/PanelFiltros';
import TarjetaEvento from '../components/TarjetaEvento';

function PantallaCatalogo({ usuario, setUsuarioActual }) {
  const [filtroCategoria, setFiltroCategoria] = useState('');
  
  // Datos simulados (luego vendrán de MySQL con fetch)
  const eventos = [
    { id_evento: 1, nombre: "Concierto de Rock", categoria: "Concierto", fecha_hora: "2026-11-01 20:00:00", lugar: "Estadio Nacional", precio: 250.00, cupos_disponibles: 100 },
    { id_evento: 2, nombre: "Taller de JavaScript", categoria: "Taller", fecha_hora: "2026-11-15 09:00:00", lugar: "Universidad", precio: 0.00, cupos_disponibles: 30 }
  ];

  // Aplicar filtros
  const eventosFiltrados = filtroCategoria 
    ? eventos.filter(e => e.categoria === filtroCategoria) 
    : eventos;

  const manejarInscripcion = (id) => {
    alert("Pronto conectaremos esto a tu Backend. ¡Clickeaste para inscribirte al evento " + id + "!");
  };

  return (
    <div>
      <BarraNavegacion usuario={usuario} setUsuarioActual={setUsuarioActual} />
      <div style={{ padding: '20px' }}>
        <h2>Catálogo de Eventos Disponibles</h2>
        <PanelFiltros setFiltroCategoria={setFiltroCategoria} />
        
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {eventosFiltrados.map(evento => (
            <TarjetaEvento key={evento.id_evento} evento={evento} onInscribir={manejarInscripcion} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default PantallaCatalogo;