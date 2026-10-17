import React from 'react';

function PanelAdministrador({
  eventos,
  nuevoEvento,
  setNuevoEvento,
  manejarCrearEvento,
  verAsistentes,
  asistentes,
  eventoSeleccionado
}) {
  return (
    <div className="admin-container" style={{ display: 'flex', gap: '40px' }}>
      <div style={{ flex: 1, backgroundColor: '#f9f9f9', padding: '20px', borderRadius: '8px', color: '#333' }}>
        <h2>Crear Evento</h2>
        <form onSubmit={manejarCrearEvento} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input required type="text" placeholder="Nombre del Evento" value={nuevoEvento.nombre} onChange={(e) => setNuevoEvento({...nuevoEvento, nombre: e.target.value})} style={{ padding: '8px' }}/>
          <textarea required placeholder="Descripción" value={nuevoEvento.descripcion} onChange={(e) => setNuevoEvento({...nuevoEvento, descripcion: e.target.value})} style={{ padding: '8px' }}/>
          <select required value={nuevoEvento.categoria} onChange={(e) => setNuevoEvento({...nuevoEvento, categoria: e.target.value})} style={{ padding: '8px' }}>
            <option value="Concierto">Concierto</option><option value="Taller">Taller</option><option value="Conferencia">Conferencia</option><option value="Feria">Feria</option>
          </select>
          <input required type="datetime-local" value={nuevoEvento.fecha_hora} onChange={(e) => setNuevoEvento({...nuevoEvento, fecha_hora: e.target.value})} style={{ padding: '8px' }}/>
          <input required type="text" placeholder="Lugar" value={nuevoEvento.lugar} onChange={(e) => setNuevoEvento({...nuevoEvento, lugar: e.target.value})} style={{ padding: '8px' }}/>
          <input required type="number" placeholder="Precio (Q)" value={nuevoEvento.precio} onChange={(e) => setNuevoEvento({...nuevoEvento, precio: e.target.value})} style={{ padding: '8px' }}/>
          <input required type="number" placeholder="Capacidad Total" value={nuevoEvento.capacidad_total} onChange={(e) => setNuevoEvento({...nuevoEvento, capacidad_total: e.target.value})} style={{ padding: '8px' }}/>
          <input required type="text" placeholder="URL de la imagen" value={nuevoEvento.imagen_url} onChange={(e) => setNuevoEvento({...nuevoEvento, imagen_url: e.target.value})} style={{ padding: '8px' }}/>
          <button type="submit" style={{ padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>Publicar Evento</button>
        </form>
      </div>

      <div style={{ flex: 1 }}>
        <h2>Listado de Eventos</h2>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {eventos.map(evento => (
            <li key={evento.id_evento} onClick={() => verAsistentes(evento.id_evento, evento.nombre)} style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '5px', cursor: 'pointer', borderRadius: '5px', backgroundColor: '#fff', color: '#333' }}>
              <strong>{evento.nombre}</strong> - Cupos: {evento.cupos_disponibles}
            </li>
          ))}
        </ul>

        {eventoSeleccionado && (
          <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '8px', color: '#333' }}>
            <h3>Asistentes a: {eventoSeleccionado}</h3>
            {asistentes.length === 0 ? <p>No hay inscritos aún.</p> : (
              <ul style={{ paddingLeft: '20px' }}>
                {asistentes.map((asistente, i) => (
                  <li key={i}>{asistente.nombre} ({asistente.correo}) - <strong>{asistente.estado}</strong></li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default PanelAdministrador;