import React from 'react';

function PantallaAuth({ modoLogin, setModoLogin, authData, setAuthData, manejarAuth }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#333' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '10px', color: 'black', width: '300px' }}>
        <h2>{modoLogin ? 'Iniciar Sesión' : 'Registro'}</h2>
        <form onSubmit={manejarAuth} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {!modoLogin && (
            <input required type="text" placeholder="Nombre completo" value={authData.nombre} onChange={(e) => setAuthData({...authData, nombre: e.target.value})} style={{ padding: '8px' }}/>
          )}
          <input required type="email" placeholder="Correo electrónico" value={authData.correo} onChange={(e) => setAuthData({...authData, correo: e.target.value})} style={{ padding: '8px' }}/>
          <input required type="password" placeholder="Contraseña" value={authData.password} onChange={(e) => setAuthData({...authData, password: e.target.value})} style={{ padding: '8px' }}/>
          
          {!modoLogin && (
            <select value={authData.rol} onChange={(e) => setAuthData({...authData, rol: e.target.value})} style={{ padding: '8px' }}>
              <option value="USUARIO">Cliente Normal</option>
              <option value="ADMIN">Administrador</option>
            </select>
          )}
          
          <button type="submit" style={{ padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
            {modoLogin ? 'Entrar' : 'Registrarme'}
          </button>
        </form>
        <button onClick={() => setModoLogin(!modoLogin)} style={{ marginTop: '15px', background: 'none', border: 'none', color: '#007bff', cursor: 'pointer', textDecoration: 'underline' }}>
          {modoLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
}

export default PantallaAuth;