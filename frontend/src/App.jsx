import React, { useState } from 'react';
import PantallaAuth from './pantallas/PantallaAuth';
import PantallaCatalogo from './pantallas/PantallaCatalogo';
import PanelAdministrador from './pantallas/PanelAdministrador';
import PantallaHistorial from './pantallas/PantallaHistorial'; // Importamos la nueva pantalla

function App() {
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [vistaActual, setVistaActual] = useState('catalogo'); // Controla si ves el catálogo o el historial

  if (!usuarioActual) {
    return <PantallaAuth onLogin={setUsuarioActual} />;
  }

  const rolLimpiado = String(usuarioActual.rol).trim().toUpperCase();

  if (rolLimpiado === 'ADMIN') {
    return <PanelAdministrador usuario={usuarioActual} setUsuarioActual={setUsuarioActual} />;
  }

  // Si el usuario normal hace clic en "Mis Eventos", mostramos el Historial
  if (vistaActual === 'historial') {
    return <PantallaHistorial usuario={usuarioActual} setUsuarioActual={setUsuarioActual} setVistaActual={setVistaActual} />;
  }

  // Por defecto, mostramos el Catálogo
  return <PantallaCatalogo usuario={usuarioActual} setUsuarioActual={setUsuarioActual} setVistaActual={setVistaActual} />;
}

export default App;