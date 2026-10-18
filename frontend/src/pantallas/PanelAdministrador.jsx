
import { useEffect, useState } from 'react';
import BarraNavegacion from '../components/BarraNavegacion';
import './PanelAdministrador.css';

function PanelAdministrador({ usuario, setUsuarioActual }) {
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [tema, setTema] = useState(() =>
    localStorage.getItem('temaOscuro') === 'true' ? 'oscuro' : 'claro'
  );

  const [idEditando, setIdEditando] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [eliminandoId, setEliminandoId] = useState(null);

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

  // Guardar tema
  useEffect(() => {
    localStorage.setItem(
      'temaOscuro',
      String(tema === 'oscuro')
    );
  }, [tema]);

  // Consultar eventos
  const cargarEventos = async () => {
    try {
      const respuesta = await fetch(
        'http://localhost:3000/api/eventos'
      );

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

  // Limpiar formulario
  const limpiarFormulario = () => {
    setNombre('');
    setDescripcion('');
    setCategoria('Concierto');
    setFechaHora('');
    setLugar('');
    setPrecio('');
    setCapacidad('');
    setImagenUrl('');
    setIdEditando(null);
  };

  // Abrir formulario para crear
  const nuevoEvento = () => {
    limpiarFormulario();
    setMostrarFormulario(true);
  };

  // Cerrar formulario
  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    limpiarFormulario();
  };

  // Preparar datos para editar
  const editarEvento = (evento) => {
    setIdEditando(evento.id_evento);
    setNombre(evento.nombre || '');
    setDescripcion(evento.descripcion || '');
    setCategoria(evento.categoria || 'Concierto');

    // Convertir fecha para datetime-local
    const fecha = evento.fecha_hora
      ? new Date(evento.fecha_hora)
      : null;

    if (fecha && !isNaN(fecha.getTime())) {
      const local = new Date(
        fecha.getTime() - fecha.getTimezoneOffset() * 60000
      );
      setFechaHora(local.toISOString().slice(0, 16));
    } else {
      setFechaHora('');
    }

    setLugar(evento.lugar || '');
    setPrecio(String(evento.precio ?? ''));
    setCapacidad(String(evento.capacidad_total ?? ''));
    setImagenUrl(evento.imagen_url || '');

    setMostrarFormulario(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Crear o actualizar evento
  const manejarSubmit = async (e) => {
    e.preventDefault();

    if (guardando) return;

    const datosEvento = {
      nombre,
      descripcion,
      categoria,
      fecha_hora: fechaHora,
      lugar,
      precio: parseFloat(precio),
      capacidad_total: parseInt(capacidad, 10),
      imagen_url: imagenUrl
    };

    const editando = idEditando !== null;

    const ruta = editando
      ? `http://localhost:3000/api/eventos/${idEditando}`
      : 'http://localhost:3000/api/eventos';

    setGuardando(true);

    try {
      const respuesta = await fetch(ruta, {
        method: editando ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(datosEvento)
      });

      const datos = await respuesta.json();

      if (respuesta.ok) {
        alert(
          datos.mensaje ||
          (editando
            ? 'Evento actualizado correctamente.'
            : 'Evento creado correctamente.')
        );

        cerrarFormulario();
        await cargarEventos();
      } else {
        alert(
          datos.error ||
          'No se pudo guardar el evento.'
        );
      }
    } catch (error) {
      alert('Error al conectar con el servidor.');
    } finally {
      setGuardando(false);
    }
  };

  // Eliminar evento
  const eliminarEvento = async (evento) => {
    const confirmar = window.confirm(
      `¿Seguro que deseas eliminar el evento "${evento.nombre}"?\n\nEsta acción puede afectar las inscripciones relacionadas.`
    );

    if (!confirmar) return;

    setEliminandoId(evento.id_evento);

    try {
      const respuesta = await fetch(
        `http://localhost:3000/api/eventos/${evento.id_evento}`,
        {
          method: 'DELETE'
        }
      );

      const datos = await respuesta.json();

      if (respuesta.ok) {
        alert(datos.mensaje || 'Evento eliminado correctamente.');

        if (idEditando === evento.id_evento) {
          cerrarFormulario();
        }

        if (eventoSeleccionado === evento.nombre) {
          setEventoSeleccionado('');
          setAsistentes([]);
        }

        await cargarEventos();
      } else {
        alert(datos.error || 'No se pudo eliminar el evento.');
      }
    } catch (error) {
      alert('Error de conexión al servidor.');
    } finally {
      setEliminandoId(null);
    }
  };

  // Consultar asistentes
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
            <p>
              Crea, modifica y administra tus eventos.
            </p>
          </div>

          <button
            className="admin-button button-secondary"
            onClick={() =>
              setTema(tema === 'claro' ? 'oscuro' : 'claro')
            }
          >
            {tema === 'claro'
              ? '◐ Tema oscuro'
              : '☀ Tema claro'}
          </button>
        </header>

        <section className="admin-card">

          <div className="section-header">
            <div>
              <h2>Eventos registrados</h2>
              <p>
                Administra tus eventos desde este panel.
              </p>
            </div>

            <button
              className="admin-button button-primary"
              onClick={() => {
                if (mostrarFormulario) {
                  cerrarFormulario();
                } else {
                  nuevoEvento();
                }
              }}
            >
              {mostrarFormulario
                ? 'Cerrar formulario'
                : '+ Crear evento'}
            </button>
          </div>

          {/* Formulario para crear y editar */}
          {mostrarFormulario && (
            <form
              className="event-form"
              onSubmit={manejarSubmit}
            >
              <h3>
                {idEditando !== null
                  ? 'Modificar evento'
                  : 'Registrar nuevo evento'}
              </h3>

              <label>
                Nombre del evento
                <input
                  type="text"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Nombre del evento"
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
                  placeholder="Lugar del evento"
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

              <div style={{
                display: 'flex',
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <button
                  className="admin-button button-success"
                  type="submit"
                  disabled={guardando}
                >
                  {guardando
                    ? 'Guardando...'
                    : idEditando !== null
                      ? 'Guardar modificaciones'
                      : 'Guardar evento'}
                </button>

                <button
                  type="button"
                  className="admin-button button-secondary"
                  onClick={cerrarFormulario}
                  disabled={guardando}
                >
                  Cancelar
                </button>
              </div>
            </form>
          )}

          {/* Tabla de eventos */}
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
                        {new Date(
                          evento.fecha_hora
                        ).toLocaleDateString('es-GT')}
                      </td>

                      <td>
                        {evento.cupos_disponibles}
                        {' / '}
                        {evento.capacidad_total}
                      </td>

                      <td>
                        <div style={{
                          display: 'flex',
                          gap: '8px',
                          flexWrap: 'wrap'
                        }}>

                          <button
                            type="button"
                            className="admin-button button-small"
                            onClick={() =>
                              verAsistentes(
                                evento.id_evento,
                                evento.nombre
                              )
                            }
                          >
                            Ver asistentes
                          </button>

                          <button
                            type="button"
                            className="admin-button button-small"
                            onClick={() => editarEvento(evento)}
                            style={{
                              backgroundColor: '#638eaf',
                              color: '#ffffff',
                              border: 'none'
                            }}
                          >
                            ✏️ Editar
                          </button>

                          <button
                            type="button"
                            className="admin-button button-small"
                            onClick={() => eliminarEvento(evento)}
                            disabled={eliminandoId === evento.id_evento}
                            style={{
                              backgroundColor: '#c85c5c',
                              color: '#ffffff',
                              border: 'none'
                            }}
                          >
                            {eliminandoId === evento.id_evento
                              ? 'Eliminando...'
                              : '🗑️ Eliminar'}
                          </button>

                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Asistentes */}
        {eventoSeleccionado && (
          <section className="admin-card">
            <div className="section-header">
              <h2>
                Asistentes: {eventoSeleccionado}
              </h2>

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
