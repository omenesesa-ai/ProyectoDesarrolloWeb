import React from 'react';

function PanelFiltros({ setFiltroCategoria }) {
  return (
    <div style={{ margin: '20px 0', padding: '15px', background: '#f8f9fa', borderRadius: '8px', color: 'black' }}>
      <label style={{ marginRight: '10px', fontWeight: 'bold' }}>Filtrar por categoría: </label>
      <select 
        onChange={(e) => setFiltroCategoria(e.target.value)} 
        style={{ padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
      >
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