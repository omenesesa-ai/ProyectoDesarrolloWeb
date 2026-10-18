import { useEffect, useState } from 'react';
import BarraNavegacion from '../components/BarraNavegacion';
import './PanelAdministrador.css';

function PanelAdministrador({ usuario, setUsuarioActual }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tema, setTema] = useState('claro');

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoria, setCategoria] = useState('Concierto');
  const [fechaHora, setFechaHora] = useState('');
  const [lugar, setLugar] = useState('');
  const [precio, setPrecio] = useState('');
  const [capacidad, setCapacidad] = useState('');
  const [imagenUrl, setImagenUrl] = useState('');

  const [eventos, setEventos] = useState([]);
  const [asistentes, setAsistentes] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState('');

  // Cargar eventos al abrir el panel
  const cargarEventos = async () => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/eventos');
      const datos = await respuesta.json();

      if (respuesta.ok) {
        setEventos(datos);
      } else {
        alert(datos.error || 'No se pudieron cargar los eventos.');
      }
    } catch (error) {
      alert('Error de conexión al servidor.');
    }
  };

  useEffect(() => {
    cargarEventos();
  }, []);

  // Crear un evento
  const manejarSubmit = async (e) => {
    e.preventDefault();

    const nuevoEvento = {
      nombre,
      descripcion,
      categoria,
      fecha_hora: fechaHora,
      lugar,
      precio: parseFloat(precio),
      capacidad_total: parseInt(capacidad, 10),
      imagen_url: imagenUrl,
    };

    try {
      const respuesta = await fetch('http://localhost:3000/api/eventos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoEvento),
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        alert(datos.mensaje || 'Evento creado correctamente.');

        setNombre('');
        setDescripcion('');
        setCategoria('Concierto');
        setFechaHora('');
        setLugar('');
        setPrecio('');
        setCapacidad('');
        setImagenUrl('');
        setMostrarFormulario(false);

        cargarEventos();
      } else {
        alert(datos.error || 'No se pudo crear el evento.');
      }
    } catch (error) {
      alert('Error de conexión al servidor.');
    }
  };

  // Consultar asistentes de un evento
  const verAsistentes = async (idEvento, nombreEvento) => {
    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/eventos/${idEvento}/asistentes`
      );

      const datos = await respuesta.json();

      if (respuesta.ok) {
        setAsistentes(datos);
        setEventoSeleccionado(nombreEvento);
      } else {
        alert(datos.error || 'No se pudieron cargar los asistentes.');
      }
    } catch (error) {
      alert('Error de conexión al servidor.');
    }
  };

  return (
    <div className="admin-page" data-tema={tema}>
      <BarraNavegacion
        usuario={usuario}
        setUsuarioActual={setUsuarioActual}
      />

      <main className="admin-container">
        <header className="admin-header">
          <div>
            <p className="admin-subtitle">Administración</p>
            <h1>Panel de administración</h1>
            <p>Gestiona los eventos y consulta sus inscripciones.</p>
          </div>

          <button
            className="admin-button button-secondary"
            onClick={() =>
              setTema(tema === 'claro' ? 'oscuro' : 'claro')
            }
          >
            {tema === 'claro' ? '◐ Tema oscuro' : '☀ Tema claro'}
          </button>
        </header>

        <section className="admin-card">
          <div className="section-header">
            <div>
              <h2>Eventos registrados</h2>
              <p>Consulta los eventos o crea uno nuevo.</p>
            </div>

            <button
              className="admin-button button-primary"
              onClick={() => setMostrarFormulario(!mostrarFormulario)}
            >
              {mostrarFormulario ? 'Cerrar formulario' : '+ Crear evento'}
            </button>
          </div>

          {mostrarFormulario && (
            <form className="event-form" onSubmit={manejarSubmit}>
              <h3>Registrar nuevo evento</h3>

              <label>
                Nombre del evento
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Concierto de Rock"
                  required
                />
              </label>

              <label>
                Descripción
                <textarea
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Descripción del evento"
                />
              </label>

              <label>
                Categoría
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                >
                  <option value="Concierto">Concierto</option>
                  <option value="Taller">Taller</option>
                  <option value="Conferencia">Conferencia</option>
                  <option value="Feria">Feria</option>
                </select>
              </label>

              <label>
                Fecha y hora
                <input
                  type="datetime-local"
                  value={fechaHora}
                  onChange={(e) => setFechaHora(e.target.value)}
                  required
                />
              </label>

              <label>
                Lugar
                <input
                  type="text"
                  value={lugar}
                  onChange={(e) => setLugar(e.target.value)}
                  placeholder="Lugar o estadio"
                  required
                />
              </label>

              <label>
                Precio en quetzales
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  placeholder="150.00"
                  required
                />
              </label>

              <label>
                Capacidad total
                <input
                  type="number"
                  min="1"
                  value={capacidad}
                  onChange={(e) => setCapacidad(e.target.value)}
                  placeholder="100"
                  required
                />
              </label>

              <label>
                URL de imagen (opcional)
                <input
                  type="url"
                  value={imagenUrl}
                  onChange={(e) => setImagenUrl(e.target.value)}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
              </label>

              <button className="admin-button button-success" type="submit">
                Guardar evento
              </button>
            </form>
          )}

          <div className="table-container">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Evento</th>
                  <th>Fecha</th>
                  <th>Cupos</th>
                  <th>Acciones</th>
                </tr>
              </thead>

              <tbody>
                {eventos.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="empty-message">
                      No hay eventos registrados.
                    </td>
                  </tr>
                ) : (
                  eventos.map((evento) => (
                    <tr key={evento.id_evento}>
                      <td>{evento.id_evento}</td>
                      <td>{evento.nombre}</td>
                      <td>
                        {new Date(evento.fecha_hora).toLocaleDateString(
                          'es-GT'
                        )}
                      </td>
                      <td>
                        {evento.cupos_disponibles} / {evento.capacidad_total}
                      </td>
                      <td>
                        <button
                          className="admin-button button-small"
                          onClick={() =>
                            verAsistentes(evento.id_evento, evento.nombre)
                          }
                        >
                          Ver asistentes
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {eventoSeleccionado && (
          <section className="admin-card">
            <div className="section-header">
              <h2>Asistentes: {eventoSeleccionado}</h2>

              <button
                className="admin-button button-secondary"
                onClick={() => setEventoSeleccionado('')}
              >
                Cerrar
              </button>
            </div>

            {asistentes.length === 0 ? (
              <p className="empty-message">
                Aún no hay personas inscritas en este evento.
              </p>
            ) : (
              <ul className="attendee-list">
                {asistentes.map((asistente, index) => (
                  <li key={index}>
                    <strong>{asistente.nombre}</strong>
                    {' — '}
                    {asistente.correo}
                    {' — Estado: '}
                    {asistente.estado}
                  </li>
                ))}
              </ul>
            )}
          </section>
        )}
      </main>
    </div>
  );
}

export default PanelAdministrador;