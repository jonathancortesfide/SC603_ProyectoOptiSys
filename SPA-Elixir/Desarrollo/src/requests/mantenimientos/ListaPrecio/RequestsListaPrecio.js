import axios from 'axios';
import {
  apiListasPrecios,
  apiListaPrecioPorId,
  apiCrearListaPrecio,
  apiActualizarListaPrecio,
  apiEliminarListaPrecio,
  apiListasPreciosPorMoneda,
  apiModificarEstadoListaPrecio
} from './DireccionesRequest';

axios.interceptors.request.use(async (config) => {
  config.headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  };
  return config;
}, function (error) {
  return Promise.reject(error);
});

axios.interceptors.response.use(async (response) => response, function (error) {
  return Promise.reject(error);
});

const obtenerListaDeListasPrecios = async () => {
  const urlApi = `${apiListasPrecios}`;
  try {
    return axios.get(urlApi)
      .then(res => { if (res.status === 200) return res.data; })
      .catch(e => {
        console.log('Error al obtener listas de precios: ' + e);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
          return [
            { id: 'lp-001', nombre: 'Estándar' },
            { id: 'lp-002', nombre: 'Premium' },
            { id: 'lp-003', nombre: 'Mayoreo' }
          ];
        }
        return [];
      });
  } catch (error) {
    console.log('Error en obtenerListaDeListasPrecios: ' + error);
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return [
        { id: 'lp-001', nombre: 'Estándar' },
        { id: 'lp-002', nombre: 'Premium' },
        { id: 'lp-003', nombre: 'Mayoreo' }
      ];
    }
    return [];
  }
};

const obtenerListaPrecioPorId = async (id) => {
  const urlApi = `${apiListaPrecioPorId}${id}`;
  try {
    return axios.get(urlApi)
      .then(res => { if (res.status === 200) return res.data; })
      .catch(e => {
        console.log('Error al obtener lista de precio: ' + e);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
          return { id, nombre: 'Estándar' };
        }
        return null;
      });
  } catch (error) {
    console.log('Error en obtenerListaPrecioPorId: ' + error);
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return { id, nombre: 'Estándar' };
    }
    return null;
  }
};

const crearListaPrecio = async (datos) => {
  const urlApi = `${apiCrearListaPrecio}`;
  console.log('URL API Crear:', urlApi);
  console.log('Datos a enviar:', datos);
  try {
    const response = await axios.post(urlApi, datos);
    console.log('Respuesta API Crear:', response);
    return response.data;
  } catch (e) {
    console.log('Error al crear lista de precio:', e);
    console.log('Error response:', e.response);
    return e.response?.data || { EsCorrecto: false, Mensaje: 'Error de conexión' };
  }
};

const actualizarListaPrecio = async (id, lista) => {
  const urlApi = `${apiActualizarListaPrecio}${id}`;
  const dataRespuesta = { Mensaje: 'Hubo un problema con la promesa', EsCorrecto: false, Data: null };
  try {
    return axios.put(urlApi, lista)
      .then(res => { if (res.status === 200) return res.data; })
      .catch(e => {
        console.log('Error al actualizar lista de precio: ' + e);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
          return { Mensaje: 'Lista de precio actualizada (mock)', EsCorrecto: true, Data: { id, ...lista } };
        }
        return dataRespuesta;
      });
  } catch (error) {
    console.log('Error en actualizarListaPrecio: ' + error);
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return { Mensaje: 'Lista de precio actualizada (mock)', EsCorrecto: true, Data: { id, ...lista } };
    }
    return dataRespuesta;
  }
};

const eliminarListaPrecio = async (id) => {
  const urlApi = `${apiEliminarListaPrecio}${id}`;
  const dataRespuesta = { Mensaje: 'Hubo un problema con la promesa', EsCorrecto: false };
  try {
    return axios.delete(urlApi)
      .then(res => { if (res.status === 200) return res.data; })
      .catch(e => {
        console.log('Error al eliminar lista de precio: ' + e);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
          return { Mensaje: 'Lista de precio eliminada (mock)', EsCorrecto: true };
        }
        return dataRespuesta;
      });
  } catch (error) {
    console.log('Error en eliminarListaPrecio: ' + error);
    if (import.meta.env.VITE_USE_MOCK === 'true') {
      return { Mensaje: 'Lista de precio eliminada (mock)', EsCorrecto: true };
    }
    return dataRespuesta;
  }
};

const obtenerListasPreciosPorMoneda = async (idMoneda) => {
  const urlApi = `${apiListasPreciosPorMoneda}${idMoneda}`;
  console.log('URL API:', urlApi);
  try {
    const response = await axios.post(urlApi);
    console.log('Respuesta API:', response);
    if (response.status === 200 && response.data && response.data.esCorrecto) {
      console.log('Datos:', response.data.laListaDePrecios);
      return response.data.laListaDePrecios || [];
    }
    return [];
  } catch (e) {
    console.log('Error al obtener listas de precios por moneda:', e);
    console.log('Error response:', e.response);
    return [];
  }
};

const modificarEstadoListaPrecio = async (id, estado) => {
  const urlApi = `${apiModificarEstadoListaPrecio}${id}/${estado}`;
  console.log('URL para cambiar estado:', urlApi);
  try {
    const response = await axios.put(urlApi);
    console.log('Respuesta al cambiar estado:', response.data);
    return response.data;
  } catch (error) {
    console.log('Error en modificarEstadoListaPrecio: ' + error);
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', error.response.data);
    }
    return { EsCorrecto: false, Mensaje: 'Error al cambiar estado de la lista de precio' };
  }
};

export {
  obtenerListaDeListasPrecios,
  obtenerListaPrecioPorId,
  crearListaPrecio,
  actualizarListaPrecio,
  eliminarListaPrecio,
  obtenerListasPreciosPorMoneda,
  modificarEstadoListaPrecio
};
