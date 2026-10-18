import React, { useState, useEffect } from 'react';
import BarraNavegacion from '../components/BarraNavegacion';

function PantallaHistorial({ usuario, setUsuarioActual, setVistaActual }) {
  const [misInscripciones, setMisInscripciones] = useState([]);

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const respuesta = await fetch(`http://localhost:3000/api/mis-inscripciones/${usuario.id_usuario}`);
        if (respuesta.ok) {
          setMisInscripciones(await respuesta.json());
        }
      } catch (error) {
        console.error("Error al cargar historial", error);
      }
    };
    cargarHistorial();
  }, [usuario.id_usuario]);

  const manejarCancelacion = async (id_evento) => {
    if (!window.confirm("¿Seguro que deseas cancelar tu inscripción?")) return;

    try {
      const respuesta = await fetch('http://localhost:3000/api/cancelar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_usuario: usuario.id_usuario, id_evento })
      });
      const data = await respuesta.json();

      if (!respuesta.ok) {
        alert("Error: " + (data.error || "No se pudo cancelar"));
      } else {
        alert("¡Éxito! " + data.mensaje);
        // Actualizamos visualmente a "CANCELADA"
        setMisInscripciones(misInscripciones.map(ins => 
          ins.id_evento === id_evento ? { ...ins, estado: 'CANCELADA' } : ins
        ));
      }
    } catch (error) {
      alert("Error de conexión al servidor");
    }
  };

  return (
    <div>
      <BarraNavegacion usuario={usuario} setUsuarioActual={setUsuarioActual} setVistaActual={setVistaActual} />
      <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h2>Mis Inscripciones 🎫</h2>
        
        <button 
          onClick={() => setVistaActual('catalogo')} 
          style={{ marginBottom: '20px', padding: '10px 15px', cursor: 'pointer', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          ⬅ Volver al Catálogo
        </button>

        {misInscripciones.length === 0 ? (
          <p>Aún no te has inscrito a ningún evento.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {misInscripciones.map(ins => (
              <div key={ins.id_evento} style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f8f9fa', color: '#333' }}>
                <div>
                  <h3 style={{ margin: '0 0 10px 0', color: '#007BFF' }}>{ins.nombre}</h3>
                  <p style={{ margin: '5px 0' }}><strong>Fecha:</strong> {new Date(ins.fecha_hora).toLocaleString()}</p>
                  <p style={{ margin: '5px 0' }}><strong>Lugar:</strong> {ins.lugar}</p>
                  <p style={{ margin: '5px 0' }}>
                    <strong>Estado:</strong> <span style={{ color: ins.estado === 'ACTIVA' ? 'green' : 'red', fontWeight: 'bold' }}>{ins.estado}</span>
                  </p>
                </div>
                {ins.estado === 'ACTIVA' && (
                  <button 
                    onClick={() => manejarCancelacion(ins.id_evento)}
                    style={{ padding: '10px', background: '#dc3545', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Cancelar Inscripción
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PantallaHistorial;