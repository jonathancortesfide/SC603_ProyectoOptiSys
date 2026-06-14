import axios from 'src/utils/axios';
import { apiObtenerSucursalesPorUsuario } from './DireccionesRequest';

const normalizarListaSucursales = (resp) => {
  if (!resp) return [];
  const keys = ['LaListaDeSucursales', 'laListaDeSucursales', 'listaSucursales', 'sucursales', 'datos', 'data', 'Data'];
  for (let i = 0; i < keys.length; i += 1) {
    const k = keys[i];
    const v = resp[k];
    if (v !== undefined && Array.isArray(v)) return v;
  }
  if (Array.isArray(resp)) return resp;
  return [];
};

/**
 * @param {string} email
 * @param {number} noEmpresa
 */
export const obtenerSucursalesPorUsuario = async (email, noEmpresa) => {
  const payload = { Email: email, NoEmpresa: Number(noEmpresa) };
  try {
    const { data } = await axios.post(apiObtenerSucursalesPorUsuario, payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
    const lista = normalizarListaSucursales(data);
    const esCorrecto = data?.EsCorrecto !== false && data?.esCorrecto !== false;
    const mensaje = data?.Mensaje ?? data?.mensaje ?? '';
    return { lista, esCorrecto, mensaje, raw: data };
  } catch (e) {
    console.error('[SucursalesAPI] obtenerSucursalesPorUsuario:', e?.response?.status, e?.response?.data ?? e?.message);
    throw e;
  }
};
