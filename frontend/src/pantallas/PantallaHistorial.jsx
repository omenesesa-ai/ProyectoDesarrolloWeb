import React, { useState, useEffect } from 'react';
import BarraNavegacion from '../components/BarraNavegacion';

function PantallaHistorial({ usuario, setUsuarioActual, setVistaActual }) {
  const [misInscripciones, setMisInscripciones] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [errorHistorial, setErrorHistorial] = useState('');
  const [procesandoId, setProcesandoId] = useState(null);
  
  const [filtroEstado, setFiltroEstado] = useState('TODAS');

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        setCargando(true);
        setErrorHistorial('');
        const respuesta = await fetch(`http://localhost:3000/api/mis-inscripciones/${usuario.id_usuario}`);
        
        if (respuesta.ok) {
          const datos = await respuesta.json();
          setMisInscripciones(datos);
        } else {
          setErrorHistorial('No se pudo obtener el historial de inscripciones.');
        }
      } catch (error) {
        console.error("Error al cargar historial", error);
        setErrorHistorial('Error de conexión con el servidor.');
      } finally {
        setCargando(false);
      }
    };

    if (usuario?.id_usuario) {
      cargarHistorial();
    }
  }, [usuario?.id_usuario]);

  const manejarCancelacion = async (id_evento) => {
    if (!window.confirm("¿Seguro que deseas cancelar tu inscripción?")) return;

    try {
      setProcesandoId(id_evento);
      const respuesta = await fetch('http://localhost:3000/api/cancelar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: usuario.id_usuario, id_evento })
      });
      const data = await respuesta.json();

      if (!respuesta.ok) {
        alert("Error: " + (data.error || "No se pudo cancelar"));
      } else {
        alert("¡Éxito! " + (data.mensaje || "Inscripción cancelada correctamente"));
        setMisInscripciones(prev => 
          prev.map(ins => ins.id_evento === id_evento ? { ...ins, estado: 'CANCELADA' } : ins)
        );
      }
    } catch (error) {
      alert("Error de conexión al servidor");
    } finally {
      setProcesandoId(null);
    }
  };

  // 1. Procesamos las inscripciones para detectar cuáles ya pasaron de fecha
  const inscripcionesProcesadas = misInscripciones.map(ins => {
    const fechaEvento = new Date(ins.fecha_hora);
    const fechaActual = new Date();
    const yaPaso = fechaEvento < fechaActual;

    // Si está activa pero ya pasó la fecha, su estado real para el usuario es FINALIZADO
    let estadoVisible = ins.estado;
    if (ins.estado === 'ACTIVA' && yaPaso) {
      estadoVisible = 'FINALIZADO';
    }

    return { ...ins, estadoVisible, yaPaso };
  });

  // 2. Filtramos basándonos en el nuevo estado calculado
  const inscripcionesFiltradas = inscripcionesProcesadas.filter(ins => {
    if (filtroEstado === 'ACTIVA') return ins.estadoVisible === 'ACTIVA';
    if (filtroEstado === 'CANCELADA') return ins.estadoVisible === 'CANCELADA';
    if (filtroEstado === 'FINALIZADO') return ins.estadoVisible === 'FINALIZADO';
    return true; // 'TODAS'
  });

  return (
    <div style={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }}>
      <BarraNavegacion usuario={usuario} setUsuarioActual={setUsuarioActual} setVistaActual={setVistaActual} />
      
      <div style={{ padding: '30px 20px', maxWidth: '950px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, color: '#1a252f' }}>Mis Inscripciones 🎫</h2>
          
          <button 
            onClick={() => setVistaActual('catalogo')} 
            style={{ padding: '10px 18px', cursor: 'pointer', background: '#fe0000', color: 'white', border: 'none', borderRadius: '6px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            ⬅ Volver al Catálogo
          </button>
        </div>

        {/* Sección de Filtros */}
        {!cargando && !errorHistorial && misInscripciones.length > 0 && (
          <div style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 'bold', color: '#495057' }}>Filtrar por estado:</span>
            
            <button onClick={() => setFiltroEstado('TODAS')} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: filtroEstado === 'TODAS' ? '#007BFF' : '#e9ecef', color: filtroEstado === 'TODAS' ? 'white' : '#495057' }}>
              Todas ({inscripcionesProcesadas.length})
            </button>
            <button onClick={() => setFiltroEstado('ACTIVA')} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: filtroEstado === 'ACTIVA' ? '#27ea4e' : '#e9ecef', color: filtroEstado === 'ACTIVA' ? 'white' : '#495057' }}>
              Próximas ({inscripcionesProcesadas.filter(i => i.estadoVisible === 'ACTIVA').length})
            </button>
            <button onClick={() => setFiltroEstado('FINALIZADO')} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: filtroEstado === 'FINALIZADO' ? '#6c757d' : '#e9ecef', color: filtroEstado === 'FINALIZADO' ? 'white' : '#495057' }}>
              Finalizadas ({inscripcionesProcesadas.filter(i => i.estadoVisible === 'FINALIZADO').length})
            </button>
            <button onClick={() => setFiltroEstado('CANCELADA')} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontWeight: '600', backgroundColor: filtroEstado === 'CANCELADA' ? '#ff0000' : '#e9ecef', color: filtroEstado === 'CANCELADA' ? 'white' : '#495057' }}>
              Canceladas ({inscripcionesProcesadas.filter(i => i.estadoVisible === 'CANCELADA').length})
            </button>
          </div>
        )}

        {cargando && <div style={{ textAlign: 'center', padding: '40px', color: '#6c757d' }}><p style={{ fontSize: '18px' }}>Cargando tus inscripciones...</p></div>}
        {!cargando && errorHistorial && <div style={{ backgroundColor: '#f8d7da', color: '#842029', padding: '15px', borderRadius: '6px', textAlign: 'center' }}>{errorHistorial}</div>}

        {!cargando && !errorHistorial && misInscripciones.length === 0 && (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center', color: '#6c757d', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '16px', margin: 0 }}>Aún no te has inscrito a ningún evento.</p>
          </div>
        )}

        {!cargando && !errorHistorial && misInscripciones.length > 0 && inscripcionesFiltradas.length === 0 && (
          <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '8px', textAlign: 'center', color: '#6c757d', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
            <p style={{ fontSize: '16px', margin: 0 }}>No hay inscripciones con este estado.</p>
          </div>
        )}

        {/* Tabla con datos filtrados */}
        {!cargando && !errorHistorial && inscripcionesFiltradas.length > 0 && (
          <div style={{ overflowX: 'auto', background: '#fff', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#007BFF', color: 'white' }}>
                  <th style={{ padding: '14px', width: '60px', textAlign: 'center' }}>N°</th>
                  <th style={{ padding: '14px' }}>Evento</th>
                  <th style={{ padding: '14px' }}>Categoría</th>
                  <th style={{ padding: '14px' }}>Fecha</th>
                  <th style={{ padding: '14px' }}>Estado</th>
                  <th style={{ padding: '14px', textAlign: 'center' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {inscripcionesFiltradas.map((ins, index) => {
                  const numeroRegistro = String(index + 1).padStart(2, '0');
                  const estaProcesando = procesandoId === ins.id_evento;

                  // Definimos los colores dependiendo del estado visible
                  let bgBadge = '#f8d7da';
                  let colorBadge = '#842029';
                  
                  if (ins.estadoVisible === 'ACTIVA') {
                    bgBadge = '#d1e7dd';
                    colorBadge = '#0f5132';
                  } else if (ins.estadoVisible === 'FINALIZADO') {
                    bgBadge = '#e2e3e5';
                    colorBadge = '#41464b';
                  }

                  return (
                    <tr key={ins.id_evento} style={{ borderBottom: '1px solid #eee', color: '#333' }}>
                      <td style={{ padding: '14px', textAlign: 'center', fontWeight: 'bold', color: '#6c757d' }}>{numeroRegistro}</td>
                      <td style={{ padding: '14px', fontWeight: '600', color: '#007BFF' }}>{ins.nombre}</td>
                      <td style={{ padding: '14px' }}><span style={{ background: '#e9ecef', padding: '4px 8px', borderRadius: '4px', fontSize: '13px' }}>{ins.categoria || 'General'}</span></td>
                      <td style={{ padding: '14px', fontSize: '14px' }}>{ins.fecha_hora ? new Date(ins.fecha_hora).toLocaleString() : 'Por confirmar'}</td>
                      <td style={{ padding: '14px' }}>
                        <span style={{ padding: '4px 10px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', backgroundColor: bgBadge, color: colorBadge }}>
                          {ins.estadoVisible}
                        </span>
                      </td>
                      <td style={{ padding: '14px', textAlign: 'center' }}>
                        {/* Solo mostramos el botón de cancelar si la inscripción es ACTIVA y NO ha pasado */}
                        {ins.estadoVisible === 'ACTIVA' ? (
                          <button 
                            onClick={() => manejarCancelacion(ins.id_evento)}
                            disabled={estaProcesando}
                            style={{ padding: '6px 14px', background: estaProcesando ? '#6c757d' : '#dc3545', color: 'white', border: 'none', borderRadius: '4px', cursor: estaProcesando ? 'not-allowed' : 'pointer', fontWeight: '600', fontSize: '13px' }}
                          >
                            {estaProcesando ? 'Procesando...' : 'Cancelar'}
                          </button>
                        ) : (
                          <span style={{ color: '#adb5bd', fontSize: '13px' }}>—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default PantallaHistorial;