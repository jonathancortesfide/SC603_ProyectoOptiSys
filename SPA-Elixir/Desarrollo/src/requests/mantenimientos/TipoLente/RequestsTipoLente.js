// RequestsTipoLente.js
import axios from '../../../utils/axios';
import { getNoEmpresa } from '../../../utils/sucursal';

import {
  apiObtenerTipoLente,
  apiObtenerTipoLentePorDescripcion,
  apiCrearTipoLente,
  apiActualizarTipoLente,
  apiEliminarTipoLente,
  apiTipoLentePorId,
  apiModificarEstadoTipoLente
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

const obtenerTipoLente = async (identificador) => {
  const id = identificador ?? getNoEmpresa();

  try {
    const response = await axios.get('/api/TipoLente/Obtener', {
      params: {
        descripcion: '',
        identificador: id
      }
    });

    if (response.status === 200 && response.data?.esCorrecto) {
      return response.data.tipoDeLente || [];
    }

    return [];
  } catch (e) {
    console.log('Error al obtener tipos de lente:', e);
    return [];
  }
};

const obtenerTipoLentePorId = async (id) => {
  const urlApi = `${apiTipoLentePorId}${id}`;
  try {
    return axios.get(urlApi)
      .then(res => { if (res.status === 200) return res.data; })
      .catch(e => {
        console.log('Error al obtener tipo de lente por ID: ' + e);
        return null;
      });
  } catch (error) {
    console.log('Error en obtenerTipoLentePorId: ' + error);
    return null;
  }
};

const obtenerTipoLentePorDescripcion = async (descripcion, identificador) => {
  const id = identificador ?? getNoEmpresa();

  try {
    const response = await axios.get('/api/TipoLente/Obtener', {
      params: {
        descripcion: descripcion,
        identificador: id
      }
    });

    if (response.status === 200 && response.data && response.data.esCorrecto) {
      return response.data.tipoDeLente || [];
    }

    return [];
  } catch (e) {
    console.log('Error al obtener tipos de lente por descripción:', e);
    return [];
  }
};

const crearTipoLente = async (data) => {
  const urlApi = `${apiCrearTipoLente}`;
  data.no_empresa = data.no_empresa || getNoEmpresa();  
  console.log('URL de crear:', urlApi);
  console.log('Data enviada:', data);

  try {
    const response = await axios.post(urlApi, data);
    console.log('Respuesta completa de crear:', response);
    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en crearTipoLente:', error);
    console.error('Error message:', error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
    }
    return { esCorrecto: false, mensaje: 'Error al crear tipo de lente' };
  }
};

const actualizarTipoLente = async (datos) => {
  const urlApi = `${apiActualizarTipoLente}`;
  console.log('URL de actualizar:', urlApi);
  console.log('Data enviada:', datos);
  try {
    const response = await axios.put(urlApi, datos);
    return response.data;
  } catch (error) {
    console.log('Error en actualizarTipoLente: ' + error);
    return { esCorrecto: false, mensaje: 'Error al actualizar tipo de lente' };
  }
};

const eliminarTipoLente = async (id) => {
  const urlApi = `${apiEliminarTipoLente}${id}`;
  try {
    const response = await axios.delete(urlApi);
    return response.data;
  } catch (error) {
    console.log('Error en eliminarTipoLente: ' + error);
    return { esCorrecto: false, mensaje: 'Error al eliminar tipo de lente' };
  }
};

const modificarEstadoTipoLente = async (id, estado) => {
  const urlApi = `${apiModificarEstadoTipoLente}${id}/${estado}`;
  console.log('URL para cambiar estado:', urlApi);
  try {
    const response = await axios.put(urlApi);
    console.log('Respuesta al cambiar estado:', response.data);
    return response.data;
  } catch (error) {
    console.log('Error en modificarEstadoTipoLente: ' + error);
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', error.response.data);
    }
    return { esCorrecto: false, mensaje: 'Error al cambiar estado del tipo de lente' };
  }
};

export {
  obtenerTipoLente,
  obtenerTipoLentePorDescripcion,
  obtenerTipoLentePorId,
  crearTipoLente,
  actualizarTipoLente,
  eliminarTipoLente,
  modificarEstadoTipoLente
};