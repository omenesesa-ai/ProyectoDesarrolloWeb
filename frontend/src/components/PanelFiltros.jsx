import React from 'react';

function PanelFiltros({ filtroCategoria, setFiltroCategoria, filtroPrecioMax, setFiltroPrecioMax }) {
  return (
    <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f5f5f5', borderRadius: '8px', display: 'flex', gap: '15px' }}>
      <div>
        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)} style={{ padding: '5px' }}>
          <option value="">Categorías (Todas)</option>
          <option value="Concierto">Concierto</option>
          <option value="Taller">Taller</option>
          <option value="Conferencia">Conferencia</option>
          <option value="Feria">Feria</option>
        </select>
      </div>
      <div>
        <input type="number" value={filtroPrecioMax} onChange={(e) => setFiltroPrecioMax(e.target.value)} placeholder="Precio Max (Q)" style={{ padding: '5px', width: '120px' }} />
      </div>
      <button onClick={() => { setFiltroCategoria(''); setFiltroPrecioMax(''); }} style={{ padding: '5px 15px', cursor: 'pointer' }}>Limpiar</button>
    </div>
  );
}

export default PanelFiltros;