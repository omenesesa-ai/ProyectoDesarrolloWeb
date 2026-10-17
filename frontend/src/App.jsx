import { useState, useEffect } from 'react';
import './App.css';

// Importación de componentes
import PantallaAuth from './components/PantallaAuth';
import BarraNavegacion from './components/BarraNavegacion';
import PanelFiltros from './components/PanelFiltros';
import TarjetaEvento from './components/TarjetaEvento';
import PanelAdministrador from './components/PanelAdministrador';

function App() {
  const [usuario, setUsuario] = useState(null);
  const [modoLogin, setModoLogin] = useState(true);
  const [authData, setAuthData] = useState({ nombre: '', correo: '', password: '', rol: 'USUARIO' });
  const [vistaActual, setVistaActual] = useState('catalogo');
  const [eventos, setEventos] = useState([]);
  const [misEventos, setMisEventos] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('');
  const [filtroPrecioMax, setFiltroPrecioMax] = useState('');

  // Estados para el Panel Admin
  const [nuevoEvento, setNuevoEvento] = useState({
    nombre: '', descripcion: '', categoria: 'Concierto', fecha_hora: '', lugar: '', precio: 0, capacidad_total: 0, imagen_url: ''
  });
  const [asistentes, setAsistentes] = useState([]);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  // Lógica de Autenticación
  const manejarAuth = async (e) => {
    e.preventDefault();
    const endpoint = modoLogin ? '/api/login' : '/api/registro';
    try {
      const respuesta = await fetch(`http://localhost:3000${endpoint}`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(authData)
      });
      const datos = await respuesta.json();
      if (respuesta.ok) {
        if (modoLogin) setUsuario(datos);
        else { alert(datos.mensaje); setModoLogin(true); }
      } else alert('Error: ' + datos.error);
    } catch (error) { alert('Error de conexión.'); }
  };

  const cerrarSesion = () => {
    setUsuario(null);
    setVistaActual('catalogo');
    setAuthData({ nombre: '', correo: '', password: '', rol: 'USUARIO' });
  };

  // Carga de Datos
  const cargarCatalogo = () => fetch('http://localhost:3000/api/eventos').then(res => res.json()).then(datos => setEventos(datos));
  const cargarHistorial = () => {
    if (usuario) {
      fetch(`http://localhost:3000/api/mis-inscripciones/${usuario.id_usuario}`).then(res => res.json()).then(datos => setMisEventos(datos));
    }
  };

  useEffect(() => {
    if (usuario) {
      if (vistaActual === 'catalogo' || vistaActual === 'admin') cargarCatalogo();
      else if (vistaActual === 'historial') cargarHistorial();
    }
  }, [vistaActual, usuario]);

  // Acciones de eventos
  const manejarInscripcion = async (id_evento) => {
    try {
      const respuesta = await fetch('http://localhost:3000/api/inscribirse', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_usuario: usuario.id_usuario, id_evento }) });
      if (respuesta.ok) { alert("¡Inscripción exitosa!"); cargarCatalogo(); } else { const datos = await respuesta.json(); alert('Error: ' + datos.error); }
    } catch (error) { alert('Error de conexión.'); }
  };

  const manejarCancelacion = async (id_evento) => {
    if (!window.confirm("¿Seguro que deseas cancelar?")) return;
    try {
      const respuesta = await fetch('http://localhost:3000/api/cancelar', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id_usuario: usuario.id_usuario, id_evento }) });
      if (respuesta.ok) { alert("Inscripción cancelada"); cargarHistorial(); } else { const datos = await respuesta.json(); alert('Error: ' + datos.error); }
    } catch (error) { alert('Error al cancelar.'); }
  };

  const manejarCrearEvento = async (e) => {
    e.preventDefault();
    try {
      const respuesta = await fetch('http://localhost:3000/api/eventos', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(nuevoEvento)
      });
      const datos = await respuesta.json();
      if (respuesta.ok) {
        alert(datos.mensaje);
        cargarCatalogo();
        setNuevoEvento({ nombre: '', descripcion: '', categoria: 'Concierto', fecha_hora: '', lugar: '', precio: 0, capacidad_total: 0, imagen_url: '' });
      } else { alert('Error: ' + datos.error); }
    } catch (error) { alert('Error al conectar.'); }
  };

  const verAsistentes = async (id_evento, nombre_evento) => {
    setEventoSeleccionado(nombre_evento);
    try {
      const respuesta = await fetch(`http://localhost:3000/api/eventos/${id_evento}/asistentes`);
      const datos = await respuesta.json();
      setAsistentes(datos);
    } catch (error) { console.error('Error al cargar asistentes:', error); }
  };

  // Filtros
  const eventosFiltrados = eventos.filter((e) => {
    return (filtroCategoria === '' || e.categoria === filtroCategoria) && (filtroPrecioMax === '' || Number(e.precio) <= Number(filtroPrecioMax));
  });

  // Renderizado Condicional por Autenticación
  if (!usuario) {
    return <PantallaAuth modoLogin={modoLogin} setModoLogin={setModoLogin} authData={authData} setAuthData={setAuthData} manejarAuth={manejarAuth} />;
  }

  return (
    <div className="app-container">
      <BarraNavegacion usuario={usuario} vistaActual={vistaActual} setVistaActual={setVistaActual} cerrarSesion={cerrarSesion} />

      {vistaActual === 'catalogo' && (
        <div className="catalogo-container">
          <PanelFiltros filtroCategoria={filtroCategoria} setFiltroCategoria={setFiltroCategoria} filtroPrecioMax={filtroPrecioMax} setFiltroPrecioMax={setFiltroPrecioMax} />
          
          <div className="grid-eventos" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {eventosFiltrados.map((evento) => (
              <TarjetaEvento key={evento.id_evento} evento={evento} manejarInscripcion={manejarInscripcion} />
            ))}
          </div>
        </div>
      )}

      {vistaActual === 'historial' && (
        <div className="historial-container">
          <h2>Mis Inscripciones</h2>
          <div className="grid-eventos" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {misEventos.map((inscripcion) => {
              const yaPaso = new Date(inscripcion.fecha_hora) < new Date();
              return (
                <div key={inscripcion.id_evento} style={{ border: `2px solid ${inscripcion.estado === 'CANCELADA' ? '#ff4d4d' : yaPaso ? '#777' : '#28a745'}`, padding: '15px', borderRadius: '8px', width: '300px' }}>
                  <h3>{inscripcion.nombre}</h3>
                  <p><strong>Fecha:</strong> {new Date(inscripcion.fecha_hora).toLocaleString()}</p>
                  <p><strong>Estado:</strong> {inscripcion.estado}</p>
                  {inscripcion.estado === 'ACTIVA' && !yaPaso && (
                    <button onClick={() => manejarCancelacion(inscripcion.id_evento)} style={{ backgroundColor: '#dc3545', color: 'white', padding: '10px', border: 'none', width: '100%', cursor: 'pointer', marginTop: '10px', borderRadius: '5px' }}>Cancelar Inscripción</button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {vistaActual === 'admin' && usuario.rol === 'ADMIN' && (
        <PanelAdministrador 
          eventos={eventos}
          nuevoEvento={nuevoEvento}
          setNuevoEvento={setNuevoEvento}
          manejarCrearEvento={manejarCrearEvento}
          verAsistentes={verAsistentes}
          asistentes={asistentes}
          eventoSeleccionado={eventoSeleccionado}
        />
      )}
    </div>
  );
}

export default App;