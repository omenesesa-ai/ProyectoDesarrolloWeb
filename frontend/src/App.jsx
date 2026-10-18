import React, { useState } from 'react';
import PantallaAuth from './pantallas/PantallaAuth';
import PantallaCatalogo from './pantallas/PantallaCatalogo';
import PanelAdministrador from './pantallas/PanelAdministrador';

function App() {
  const [usuarioActual, setUsuarioActual] = useState(null); // null significa que no ha iniciado sesión

  // Si no hay usuario logueado, mostramos la pantalla de Login
  if (!usuarioActual) {
    return <PantallaAuth onLogin={setUsuarioActual} />;
  }

  // Si el usuario es ADMIN, mostramos el Panel de Control
  if (usuarioActual.rol === 'ADMIN') {
    return <PanelAdministrador usuario={usuarioActual} setUsuarioActual={setUsuarioActual} />;
  }

  // Si es un usuario normal, mostramos el Catálogo de eventos
  return <PantallaCatalogo usuario={usuarioActual} setUsuarioActual={setUsuarioActual} />;
}

export default App;