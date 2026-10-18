import React from 'react';

function PanelFiltros({ setFiltroCategoria }) {
  return (
    <div style={{ margin: '20px 0' }}>
      <label><strong>Filtrar por categoría: </strong></label>
      <select onChange={(e) => setFiltroCategoria(e.target.value)} style={{ padding: '5px' }}>
        <option value="">Todas las categorías</option>
        <option value="Concierto">Concierto</option>
        <option value="Taller">Taller</option>
        <option value="Conferencia">Conferencia</option>
        <option value="Feria">Feria</option>
      </select>
    </div>
  );
}

export default PanelFiltros;