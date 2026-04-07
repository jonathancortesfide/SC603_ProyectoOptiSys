import axios from 'axios';
import { apiObtenerProductos, apiAgregarProducto, apiEliminarProducto } from './DireccionesRequest';
import { ejemploListaProductos } from '../../../views/seguridad/ejemplosDatos';

axios.interceptors.request.use((config) => {
  config.headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  return config;
}, (error) => Promise.reject(error));

let _cacheProductos = { data: null, ts: 0 };
const _CACHE_TTL = 30 * 1000;

const obtenerListaDeProductos = async () => {
  const now = Date.now();
  if (_cacheProductos.data && (now - _cacheProductos.ts) < _CACHE_TTL) return _cacheProductos.data;
  if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploListaProductos;
  try {
    const res = await axios.get(apiObtenerProductos);
    if (res.status === 200) {
      _cacheProductos = { data: res.data, ts: Date.now() };
      return res.data;
    }
    return [];
  } catch (err) {
    console.error('Error obtenerListaDeProductos', err);
    if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploListaProductos;
    return [];
  }
};

const AgregarProducto = async (producto) => {
  try {
    const res = await axios.post(apiAgregarProducto, producto);
    _cacheProductos = { data: null, ts: 0 };
    return res.data;
  } catch (err) {
    console.error('Error AgregarProducto', err);
    return { EsCorrecto: false, Mensaje: 'Error' };
  }
};

const eliminarProducto = async (id) => {
  try {
    const res = await axios.delete(`${apiEliminarProducto}${id}`);
    _cacheProductos = { data: null, ts: 0 };
    return res.data;
  } catch (err) {
    console.error('Error eliminarProducto', err);
    return { EsCorrecto: false, Mensaje: 'Error' };
  }
};

export { obtenerListaDeProductos, AgregarProducto, eliminarProducto };
