import React, { useState, useEffect } from 'react';
import BarraNavegacion from '../components/BarraNavegacion';

function PanelAdministrador({ usuario, setUsuarioActual }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  
  // Estados del formulario
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('Concierto');
  const [fechaHora, setFechaHora] = useState('');
  const [lugar, setLugar] = useState('');
  const [precio, setPrecio] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');

  // Estados para los reportes
  const [eventos, setEventos] = useState([]);
  const [asistentes, setAsistentes] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  // Cargar todos los eventos al entrar al panel
  const cargarEventos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/eventos');
      const data = await respuesta.json();
      if (respuesta.ok) {
        setEventos(data);
      }
    } catch (error) {
      console.error("Error al cargar los eventos:", error);
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  // Función para guardar un nuevo evento
  const manejarSubmit = async (e) => {
    e.preventDefault();
    const nuevoEvento = {
      nombre, descripcion, categoria, fecha_hora: fechaHora, lugar,
      precio: parseFloat(precio), capacidad_total: parseInt(capacidad), imagen_url: imagenUrl
    };

    try {
      const respuesta = await fetch('http://localhost:3000/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoEvento)
      });
      const data = await respuesta.json();

      if (!respuesta.ok) {
        alert("Error: " + (data.error || "No se pudo crear el evento"));
      } else {
        alert("¡Éxito! " + data.mensaje);
        setMostrarFormulario(false); 
        // Limpiamos los campos
        setNombre(''); setDescripcion(''); setFechaHora(''); setLugar(''); 
        setPrecio(''); setCapacidad(''); setImagenUrl('');
        // Recargamos la tabla para ver el nuevo evento
        cargarEventos();
      }
    } catch (error) {
      alert("Error de conexión al servidor");
    }
  };

  // Función para ver quién está inscrito en un evento
  const verAsistentes = async (id_evento, nombre_evento) => {
    try {
      const respuesta = await fetch(`http://localhost:3000/api/eventos/${id_evento}/asistentes`);
      const data = await respuesta.json();
      if (respuesta.ok) {
        setAsistentes(data);
        setEventoSeleccionado(nombre_evento);
      } else {
        alert("Error al obtener asistentes: " + data.error);
      }
    } catch (error) {
      alert("Error de conexión al servidor");
    }
  };

  return (
    <div>
      <BarraNavegacion usuario={usuario} setUsuarioActual={setUsuarioActual} />
      
      <div style={{ padding: '20px', maxWidth: '1000px', margin: '0 auto' }}>
        <h2>Panel de Administración ⚙️</h2>
        <p>Bienvenido al área protegida. Aquí podrás crear nuevos eventos y ver los reportes de inscripciones.</p>
        
        <button 
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
          style={{ padding: '10px 20px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', marginBottom: '20px' }}
        >
          {mostrarFormulario ? 'Ocultar Formulario' : '+ Crear Nuevo Evento'}
        </button>

        {mostrarFormulario && (
          <form onSubmit={manejarSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', background: '#f8f9fa', padding: '20px', borderRadius: '8px', color: 'black', marginBottom: '30px' }}>
            <h3>Registrar Nuevo Evento en el Catálogo</h3>
            
            <input type="text" placeholder="Nombre del evento (ej. Concierto de Rock)" value={nombre} onChange={e => setNombre(e.target.value)} required style={{ padding: '10px' }}/>
            <textarea placeholder="Descripción del evento" value={descripcion} onChange={e => setDescripcion(e.target.value)} style={{ padding: '10px', minHeight: '80px' }}></textarea>
            
            <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ padding: '10px' }}>
              <option value="Concierto">Concierto</option>
              <option value="Taller">Taller</option>
              <option value="Conferencia">Conferencia</option>
              <option value="Feria">Feria</option>
            </select>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '12px', color: '#666' }}>Fecha y Hora</label>
                <input type="datetime-local" value={fechaHora} onChange={e => setFechaHora(e.target.value)} required style={{ padding: '10px' }}/>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '12px', color: '#666' }}>Lugar</label>
                <input type="text" placeholder="Lugar o Estadio" value={lugar} onChange={e => setLugar(e.target.value)} required style={{ padding: '10px' }}/>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '12px', color: '#666' }}>Precio (Quetzales)</label>
                <input type="number" step="0.01" placeholder="Ej. 150.00" value={precio} onChange={e => setPrecio(e.target.value)} required style={{ padding: '10px' }}/>
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <label style={{ fontSize: '12px', color: '#666' }}>Capacidad Total de Personas</label>
                <input type="number" placeholder="Ej. 100" value={capacidad} onChange={e => setCapacidad(e.target.value)} required style={{ padding: '10px' }}/>
              </div>
            </div>

            <input type="text" placeholder="URL de la imagen (opcional)" value={imagenUrl} onChange={e => setImagenUrl(e.target.value)} style={{ padding: '10px' }}/>
            
            <button type="submit" style={{ padding: '12px', background: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}>
              Guardar Evento
            </button>
          </form>
        )}

        <hr style={{ borderColor: '#444', margin: '30px 0' }} />

        {/* Sección de Gestión de Eventos y Reportes */}
        <h3>Gestión de Eventos Creados</h3>
        {eventos.length === 0 ? (
          <p>No hay eventos registrados en el sistema.</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px', background: '#fff', color: '#000' }}>
              <thead>
                <tr style={{ background: '#333', color: '#fff' }}>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>ID</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Nombre</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Fecha</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Cupos</th>
                  <th style={{ padding: '10px', border: '1px solid #ddd' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {eventos.map(ev => (
                  <tr key={ev.id_evento}>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{ev.id_evento}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{ev.nombre}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd' }}>{new Date(ev.fecha_hora).toLocaleDateString()}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>{ev.cupos_disponibles} / {ev.capacidad_total}</td>
                    <td style={{ padding: '10px', border: '1px solid #ddd', textAlign: 'center' }}>
                      <button 
                        onClick={() => verAsistentes(ev.id_evento, ev.nombre)}
                        style={{ padding: '5px 10px', background: '#007BFF', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                      >
                        Ver Asistentes
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal / Sección para mostrar los asistentes del evento seleccionado */}
        {eventoSeleccionado && (
          <div style={{ marginTop: '30px', padding: '20px', background: '#e9ecef', borderRadius: '8px', color: '#000' }}>
            <h3>👥 Asistentes para: {eventoSeleccionado}</h3>
            <button 
              onClick={() => setEventoSeleccionado(null)}
              style={{ padding: '5px 10px', background: '#6c757d', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginBottom: '15px' }}
            >
              Cerrar Reporte
            </button>

            {asistentes.length === 0 ? (
              <p>Aún no hay usuarios inscritos en este evento.</p>
            ) : (
              <ul>
                {asistentes.map((asistente, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>
                    <strong>{asistente.nombre}</strong> ({asistente.correo}) - Estado: <span style={{ color: asistente.estado === 'ACTIVA' ? 'green' : 'red' }}>{asistente.estado}</span>
                  </li>
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