import axios from '../../utils/axios';
import { getNoEmpresa } from '../../utils/empresa';

const apiBase = import.meta.env.VITE_ApiBase;

const apiObtenerTiposLente        = `${apiBase}/TipoLente/Obtener`;
const apiObtenerMaterialesPorTipo = `${apiBase}/Productos/ObtenerProductosMT`;
const apiObtenerProductosAro      = `${apiBase}/Productos/ObtenerProductosAR`;
const apiObtenerLaboratorios      = `${apiBase}/Proveedores/ObtenerLaboratorios`;

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

const obtenerTiposLente = async (identificador) => {
  const id = identificador ?? getNoEmpresa();

  try {
    const response = await axios.get(apiObtenerTiposLente, {
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

const obtenerMaterialesPorTipo = async (identificador, noTipo) => {
  const id = identificador ?? getNoEmpresa();

  try {
    const response = await axios.get(
      `${apiObtenerMaterialesPorTipo}/${encodeURIComponent(id)}/${encodeURIComponent(noTipo)}`
    );

    const data = response.data;

    return Array.isArray(data)
      ? data
      : Array.isArray(data?.laListaDeProductos)
      ? data.laListaDeProductos
      : [];
  } catch (e) {
    console.log('Error al obtener materiales por tipo:', e);
    return [];
  }
};

const obtenerProductosAro = async (descripcion, identificador) => {
  const id = identificador ?? getNoEmpresa();

  try {
    const response = await axios.get(
      `${apiObtenerProductosAro}/${encodeURIComponent(id)}/${encodeURIComponent(descripcion)}`
    );

    const data = response.data;

    return Array.isArray(data)
      ? data
      : Array.isArray(data?.laListaDeProductos)
      ? data.laListaDeProductos
      : Array.isArray(data?.productos)
      ? data.productos
      : [];
  } catch (e) {
    console.log('Error al obtener productos de aro:', e);
    return [];
  }
};

const obtenerLaboratorios = async (identificador) => {
  const id = identificador ?? getNoEmpresa();

  try {
    const response = await axios.get(
      `${apiObtenerLaboratorios}/${encodeURIComponent(id)}`
    );

    const data = response.data;

    return Array.isArray(data)
      ? data
      : Array.isArray(data?.laListaDeProveedores)
      ? data.laListaDeProveedores
      : Array.isArray(data?.proveedores)
      ? data.proveedores
      : [];
  } catch (e) {
    console.log('Error al obtener laboratorios:', e);
    return [];
  }
};

export {
  obtenerTiposLente,
  obtenerMaterialesPorTipo,
  obtenerProductosAro,
  obtenerLaboratorios
};