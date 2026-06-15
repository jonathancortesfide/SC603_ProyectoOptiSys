import axios from 'src/utils/axios';
import { apiObtenerEmpresasPorUsuario } from './DireccionesRequest';

const normalizarListaEmpresas = (resp) => {
  if (!resp) return [];
  const keys = ['LaListaDeEmpresas', 'laListaDeEmpresas', 'listaEmpresas', 'empresas', 'datos', 'data', 'Data'];
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
 * @returns {Promise<{ lista: object[], esCorrecto: boolean, mensaje: string, raw: object }>}
 */
export const obtenerEmpresasPorUsuario = async (email) => {
  const payload = { Email: email };
  try {
    const { data } = await axios.post(apiObtenerEmpresasPorUsuario, payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
    const lista = normalizarListaEmpresas(data);
    const esCorrecto = data?.EsCorrecto !== false && data?.esCorrecto !== false;
    const mensaje = data?.Mensaje ?? data?.mensaje ?? '';
    return { lista, esCorrecto, mensaje, raw: data };
  } catch (e) {
    console.error('[EmpresasAPI] obtenerEmpresasPorUsuario:', e?.response?.status, e?.response?.data ?? e?.message);
    throw e;
  }
};
