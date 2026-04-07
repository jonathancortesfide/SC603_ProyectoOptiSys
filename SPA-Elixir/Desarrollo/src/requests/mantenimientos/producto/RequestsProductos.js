import axios from 'axios';
import { apiObtenerProductos, apiAgregarProducto, apiActualizarProducto, apiEliminarProducto } from './DireccionesRequest';
import { ejemploListaProductos } from '../../../views/seguridad/ejemplosDatos';
import { getSucursalIdentificador } from '../../../utils/sucursal';

axios.interceptors.request.use((config) => {
  config.headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  return config;
}, (error) => Promise.reject(error));

let _cacheProductos = { data: null, ts: 0 };
const _CACHE_TTL = 30 * 1000;
const sucursalIdentificador = getSucursalIdentificador();

const normalizarProducto = (producto) => ({
  noProducto: producto?.noProducto ?? producto?.id ?? 0,
  noEmpresa: producto?.noEmpresa ?? sucursalIdentificador,
  tipoArticulo: producto?.tipoArticulo ?? '',
  codigoInterno: producto?.codigoInterno ?? '',
  codigoBarras: producto?.codigoBarras ?? '',
  codigoAuxiliar: producto?.codigoAuxiliar ?? '',
  nombre: producto?.nombre ?? '',
  codigoCabys: producto?.codigoCabys ?? '',
  unidadMedida: producto?.unidadMedida ?? '',
  tipoImpuesto: producto?.tipoImpuesto ?? '',
  porcentajeImpuesto: Number(producto?.porcentajeImpuesto ?? 0),
  existencia: Number(producto?.existencia ?? 0),
  activo: producto?.activo ?? producto?.esActivo ?? true,
});

const mapProductoToFrontend = (producto) => ({
  noProducto: producto?.noProducto ?? 0,
  id: producto?.noProducto ?? 0,
  noEmpresa: producto?.noEmpresa ?? sucursalIdentificador,
  tipoArticulo: producto?.tipoArticulo ?? '',
  codigoInterno: producto?.codigoInterno ?? '',
  codigoBarras: producto?.codigoBarras ?? '',
  codigoAuxiliar: producto?.codigoAuxiliar ?? '',
  nombre: producto?.nombre ?? '',
  codigoCabys: producto?.codigoCabys ?? '',
  unidadMedida: producto?.unidadMedida ?? '',
  tipoImpuesto: producto?.tipoImpuesto ?? '',
  porcentajeImpuesto: Number(producto?.porcentajeImpuesto ?? 0),
  existencia: Number(producto?.existencia ?? 0),
  activo: producto?.activo ?? true,
  esActivo: producto?.activo ?? true,
  fechaCreacion: producto?.fechaCreacion ?? null,
  fechaModificacion: producto?.fechaModificacion ?? null,
});

const obtenerListaDeProductos = async () => {
  const now = Date.now();
  if (_cacheProductos.data && (now - _cacheProductos.ts) < _CACHE_TTL) return _cacheProductos.data;
  if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploListaProductos;
  try {
    const res = await axios.get(apiObtenerProductos);
    if (res.status === 200) {
      const productos = Array.isArray(res.data) ? res.data.map(mapProductoToFrontend) : [];
      _cacheProductos = { data: productos, ts: Date.now() };
      return productos;
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
    const res = await axios.post(apiAgregarProducto, normalizarProducto(producto));
    _cacheProductos = { data: null, ts: 0 };
    return res.data;
  } catch (err) {
    console.error('Error AgregarProducto', err);
    return { EsCorrecto: false, Mensaje: 'Error' };
  }
};

const actualizarProducto = async (id, producto) => {
  try {
    const payload = {
      ...normalizarProducto(producto),
      noProducto: id,
    };
    const res = await axios.put(`${apiActualizarProducto}${id}`, payload);
    _cacheProductos = { data: null, ts: 0 };
    return res.data;
  } catch (err) {
    console.error('Error actualizarProducto', err);
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

export { obtenerListaDeProductos, AgregarProducto, actualizarProducto, eliminarProducto };
