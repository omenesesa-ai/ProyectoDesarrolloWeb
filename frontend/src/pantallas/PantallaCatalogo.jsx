
import React, { useState, useEffect } from 'react';
import BarraNavegacion from '../components/BarraNavegacion';
import PanelFiltros from '../components/PanelFiltros';
import TarjetaEvento from '../components/TarjetaEvento';

function PantallaCatalogo({ usuario, setUsuarioActual, setVistaActual }) {
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [eventos, setEventos] = useState([]);
  const [misInscripciones, setMisInscripciones] = useState([]);

  // Leer el tema guardado desde el inicio de sesion
  const [modoOscuro, setModoOscuro] = useState(() => {
    return localStorage.getItem('temaOscuro') === 'true';
  });

  // Guardar el tema cuando cambie
  useEffect(() => {
    localStorage.setItem('temaOscuro', String(modoOscuro));
  }, [modoOscuro]);

  const cargarDatos = async () => {
    try {
      const resEventos = await fetch('http://localhost:3000/api/eventos');
      if (resEventos.ok) setEventos(await resEventos.json());

      const resInscripciones = await fetch(
        `http://localhost:3000/api/mis-inscripciones/${usuario.id_usuario}`
      );

      if (resInscripciones.ok) {
        setMisInscripciones(await resInscripciones.json());
      }
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
        body: JSON.stringify({
          id_usuario: usuario.id_usuario,
          id_evento
        })
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

  // Colores del catalogo
  const colores = {
    fondo: modoOscuro
      ? 'linear-gradient(135deg, #142132, #23364a, #182638)'
      : 'linear-gradient(135deg, #eaf4fa, #d9e9f3, #edf5f8)',

    titulo: modoOscuro ? '#7aa9de' : '#294d6b',
    texto: modoOscuro ? '#b5c5d5' : '#526b80',
    panel: modoOscuro ? '#25364a' : '#ffffff',
    borde: modoOscuro ? '#405267' : '#d8e3ed',
    boton: '#638eaf'
  };

  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      background: colores.fondo,
      color: colores.texto,
      fontFamily: 'Arial, sans-serif',
      transition: 'background 0.3s ease'
    }}>

      <BarraNavegacion
        usuario={usuario}
        setUsuarioActual={setUsuarioActual}
        setVistaActual={setVistaActual}
      />

      <div style={{
        padding: '30px 25px',
        maxWidth: '1250px',
        margin: '0 auto'
      }}>

        {/* Encabezado del catalogo */}
        <div style={{
          backgroundColor: colores.panel,
          padding: '25px',
          borderRadius: '16px',
          marginBottom: '25px',
          boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
          border: `1px solid ${colores.borde}`
        }}>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '15px'
          }}>

            <div>
              <h2 style={{
                color: colores.titulo,
                margin: '0 0 10px',
                fontSize: '27px'
              }}>
                Catálogo de Eventos Disponibles
              </h2>

              <p style={{
                color: colores.texto,
                fontSize: '14px',
                margin: 0
              }}>
                Explora los eventos disponibles y participa
                en los que más te interesen.
              </p>
            </div>

            {/* Boton para cambiar tema */}
            <button
              type="button"
              onClick={() => setModoOscuro(!modoOscuro)}
              style={{
                backgroundColor: colores.boton,
                color: '#ffffff',
                padding: '12px 18px',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              {modoOscuro ? '☀️ Modo claro' : '🌙 Modo oscuro'}
            </button>

          </div>
        </div>

        {/* Panel de filtros */}
        <div style={{
          backgroundColor: colores.panel,
          padding: '22px',
          borderRadius: '15px',
          marginBottom: '25px',
          border: `1px solid ${colores.borde}`,
          boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
        }}>

          <PanelFiltros setFiltroCategoria={setFiltroCategoria} />

          <p style={{
            marginTop: '18px',
            marginBottom: '0',
            color: colores.texto,
            fontSize: '14px'
          }}>
            Mostrando <strong>{eventosFiltrados.length}</strong> evento(s)
            {filtroCategoria
              ? ` en la categoría ${filtroCategoria}`
              : ' en total'}.
          </p>

        </div>

        {/* Listado de eventos */}
        {eventos.length === 0 ? (
          <div style={{
            backgroundColor: colores.panel,
            padding: '35px',
            borderRadius: '15px',
            textAlign: 'center',
            color: colores.texto
          }}>
            <p>Cargando eventos o la base de datos está vacía...</p>
          </div>
        ) : (
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '20px',
            justifyContent: 'center'
          }}>

            {eventosFiltrados.map(evento => {
              const estaInscrito = misInscripciones.some(
                ins =>
                  ins.id_evento === evento.id_evento &&
                  ins.estado === 'ACTIVA'
              );

              return (
                <TarjetaEvento
                  key={evento.id_evento}
                  evento={evento}
                  onInscribir={manejarInscripcion}
                  yaInscrito={estaInscrito}
                />
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default PantallaCatalogo;
