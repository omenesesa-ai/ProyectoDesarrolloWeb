import React, { useState, useEffect } from 'react';
import BarraNavegacion from '../components/BarraNavegacion';
import PanelFiltros from '../components/PanelFiltros';
import TarjetaEvento from '../components/TarjetaEvento';

function PantallaCatalogo({ usuario, setUsuarioActual, setVistaActual }) {
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [eventos, setEventos] = useState([]); 
  const [misInscripciones, setMisInscripciones] = useState([]);

  const cargarDatos = async () => {
    try {
      const resEventos = await fetch('http://localhost:3000/api/eventos');
      if (resEventos.ok) setEventos(await resEventos.json());

      const resInscripciones = await fetch(`http://localhost:3000/api/mis-inscripciones/${usuario.id_usuario}`);
      if (resInscripciones.ok) setMisInscripciones(await resInscripciones.json());
    } catch (error) {
      console.error("Error al cargar datos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, [usuario.id_usuario]); 

  const eventosFiltrados = filtroCategoria 
    ? eventos.filter(e => e.categoria === filtroCategoria) 
    : eventos;

  const manejarInscripcion = async (id_evento) => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/inscribirse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: usuario.id_usuario, id_evento })
      });

      const data = await respuesta.json();
      
      if (!respuesta.ok) {
        alert("Error: " + (data.error || "No se pudo inscribir"));
      } else {
        alert("¡Éxito! " + data.mensaje);
        cargarDatos();
      }
    } catch (error) {
      alert("Error de conexión al servidor");
    }
  };

  return (
    <div>
      <BarraNavegacion usuario={usuario} setUsuarioActual={setUsuarioActual} setVistaActual={setVistaActual} />
      <div style={{ padding: '20px' }}>
        
        <h2>Catálogo de Eventos Disponibles</h2>
        
        <PanelFiltros setFiltroCategoria={setFiltroCategoria} />
        
        <p style={{ marginTop: '10px' }}>
          Mostrando <strong>{eventosFiltrados.length}</strong> evento(s) {filtroCategoria ? `en la categoría ${filtroCategoria}` : 'en total'}.
        </p>

        {eventos.length === 0 ? (
          <p>Cargando eventos o la base de datos está vacía...</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {eventosFiltrados.map(evento => {
              const estaInscrito = misInscripciones.some(ins => ins.id_evento === evento.id_evento && ins.estado === 'ACTIVA');

              return (
                <TarjetaEvento 
                  key={evento.id_evento} 
                  evento={evento} 
                  onInscribir={manejarInscripcion} 
                  yaInscrito={estaInscrito}
                />
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default PantallaCatalogo;