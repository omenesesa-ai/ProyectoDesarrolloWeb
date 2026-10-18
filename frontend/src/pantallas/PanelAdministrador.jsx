import React from 'react';
import BarraNavegacion from '../components/BarraNavegacion';

function PanelAdministrador({ usuario, setUsuarioActual }) {
  return (
    <div>
      <BarraNavegacion usuario={usuario} setUsuarioActual={setUsuarioActual} />
      <div style={{ padding: '20px' }}>
        <h2>Panel de Administración ⚙️</h2>
        <p>Bienvenido al área protegida. Aquí podrás crear nuevos eventos y ver los reportes de inscripciones.</p>
        <button style={{ padding: '10px 20px', background: '#17a2b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
          + Crear Nuevo Evento
        </button>
      </div>
    </div>
  );
}

export default PanelAdministrador;