const normalizarBase = (v) => {
  const s = v == null || v === '' ? '/api' : String(v).trim().replace(/^["']|["']$/g, '');
  const out = s.replace(/\/$/, '');
  return out || '/api';
};

const apiBase = normalizarBase(import.meta.env.VITE_ApiBase);

/** POST — cuerpo { Email } (camelCase admitido por el API). */
const apiObtenerEmpresasPorUsuario = `${apiBase}/EmpresaSucursal/ObtenerEmpresasPorUsuario`;

/** POST — cuerpo { Email, NoEmpresa }. */
const apiObtenerSucursalesPorUsuario = `${apiBase}/EmpresaSucursal/ObtenerSucursalesPorUsuario`;

export { apiBase, apiObtenerEmpresasPorUsuario, apiObtenerSucursalesPorUsuario };
