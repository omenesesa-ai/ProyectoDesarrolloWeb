import React, { useState, useEffect } from 'react';
import BarraNavegacion from '../components/BarraNavegacion';
import PanelFiltros from '../components/PanelFiltros';
import TarjetaEvento from '../components/TarjetaEvento';

function PantallaCatalogo({ usuario, setUsuarioActual, setVistaActual }) {
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [eventos, setEventos] = useState([]); 
  const [misInscripciones, setMisInscripciones] = useState([]); // Nueva memoria para tus inscripciones

  // Creamos una función para cargar todo que podamos reutilizar
  const cargarDatos = async () => {
    try {
      // 1. Traemos el catálogo de eventos
      const resEventos = await fetch('http://localhost:3000/api/eventos');
      if (resEventos.ok) setEventos(await resEventos.json());

      // 2. Traemos tu historial para saber a cuáles ya estás inscrito
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
        // RECARGAMOS LOS DATOS: Esto actualizará los cupos y pondrá el botón en "Ya Inscrito"
        cargarDatos();
      }
    } catch (error) {
      alert("Error de conexión al servidor");
    }
  };

  return (
    <div>
      {/* CORRECCIÓN: Ahora sí pasamos setVistaActual para que aparezca el botón "Mis Eventos" */}
      <BarraNavegacion usuario={usuario} setUsuarioActual={setUsuarioActual} setVistaActual={setVistaActual} />
      <div style={{ padding: '20px' }}>
        <h2>Catálogo de Eventos Disponibles</h2>
        
        <PanelFiltros setFiltroCategoria={setFiltroCategoria} />
        
        {eventos.length === 0 ? (
          <p>Cargando eventos o la base de datos está vacía...</p>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {eventosFiltrados.map(evento => {
              // Verificamos si este usuario ya tiene una inscripción ACTIVA en este evento
              const estaInscrito = misInscripciones.some(ins => ins.id_evento === evento.id_evento && ins.estado === 'ACTIVA');

              return (
                <TarjetaEvento 
                  key={evento.id_evento} 
                  evento={evento} 
                  onInscribir={manejarInscripcion} 
                  yaInscrito={estaInscrito} // Le avisamos a la tarjeta si ya está inscrito
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