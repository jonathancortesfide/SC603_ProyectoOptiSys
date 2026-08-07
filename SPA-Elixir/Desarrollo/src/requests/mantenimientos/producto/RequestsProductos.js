import axios from 'axios';
import {
  apiObtenerProductos,
  apiObtenerProductoPorId,
  apiAgregarProducto,
  apiModificarProducto,
  apiModificarEstadoProducto,
  apiEliminarProducto,
  apiObtenerProductosMT,
  apiObtenerProductosAR,
} from './DireccionesRequest';
import { ejemploListaProductos } from '../../../views/seguridad/ejemplosDatos';

// ============================================
// CONFIGURACIÓN DE AXIOS
// ============================================

axios.interceptors.request.use(
  (config) => {
    config.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    // Agregar token si existe - buscar en accessToken (donde se guarda)
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token enviado en header Authorization');
    } else {
      console.warn('⚠️ No hay token disponible en localStorage');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ============================================
// CACHÉ
// ============================================

let _cacheProductos = { data: null, ts: 0 };
const _CACHE_TTL = 30 * 1000; // 30 segundos

// ============================================
// OBTENER PRODUCTOS
// ============================================

/**
 * Obtiene lista de productos filtrados por empresa y búsqueda
 * @param {number} noEmpresa - Número de empresa
 * @param {string} textoBusqueda - Texto para buscar (opcional)
 * @returns {Promise<Array>} Lista de productos
 */
const obtenerListaDeProductos = async (noEmpresa = 1, textoBusqueda = '') => {
  const now = Date.now();
  const cacheKey = `${noEmpresa}_${textoBusqueda}`;

  // Usar caché si está disponible
  if (_cacheProductos.data && now - _cacheProductos.ts < _CACHE_TTL && _cacheProductos.cacheKey === cacheKey) {
    console.log('📦 Usando datos de CACHÉ');
    return _cacheProductos.data;
  }

  try {
    console.log('📤 Enviando solicitud a obtenerListaDeProductos:', {
      url: apiObtenerProductos,
      params: { noEmpresa, textoBusqueda },
    });

    // Usar parámetros en formato camelCase (como usa Axios por defecto y como muestra el manual)
    // Solo incluir textoBusqueda si tiene contenido
    const params = { noEmpresa };
    if (textoBusqueda && textoBusqueda.trim()) {
      params.textoBusqueda = textoBusqueda.trim();
    }
    
    const response = await axios.get(apiObtenerProductos, {
      params,
      timeout: import.meta.env.VITE_API_TIMEOUT_MS || 60000,
    });

    console.log('✅ Respuesta del API:', response.status, response.data);

    if (response.status === 200 || response.status === 201) {
      // El backend devuelve datos en response.data.laListaDeProductos
      const datos = response.data?.laListaDeProductos || [];
      
      if (Array.isArray(datos)) {
        _cacheProductos = { data: datos, ts: Date.now(), cacheKey };
        console.log('✅ Productos cargados exitosamente de la BD:', datos.length, 'registros');
        return datos;
      } else {
        console.warn('⚠️ Backend devolvió datos en formato no esperado:', datos);
        return [];
      }
    }

    console.warn('⚠️ Respuesta inesperada con status:', response.status);
    return [];

  } catch (err) {
    console.error('❌ ERROR obtenerListaDeProductos:', {
      status: err.response?.status,
      statusText: err.response?.statusText,
      data: err.response?.data,
      url: err.config?.url,
      params: err.config?.params,
      headers: err.config?.headers,
      message: err.message,
    });

    throw err;
  }
};

// ============================================
// OBTENER PRODUCTO POR ID
// ============================================

/**
 * Obtiene un producto específico por ID
 * @param {number} idProducto - ID del producto
 * @returns {Promise<Object>} Datos del producto
 */
const obtenerProductoPorId = async (idProducto) => {
  if (!idProducto) {
    throw new Error('ID de producto requerido');
  }

  try {
    const response = await axios.get(apiObtenerProductoPorId, {
      params: { IdProducto: idProducto },
    });

    if (response.status === 200) {
      // Backend devuelve estructura ProductoDetalleConModeloDeValidacion con propiedad Producto
      return response.data?.producto || response.data || null;
    }
    return null;
  } catch (err) {
    console.error('Error obtenerProductoPorId:', err);
    throw err;
  }
};

// ============================================
// AGREGAR PRODUCTO
// ============================================

/**
 * Crea un nuevo producto
 * @param {Object} producto - Datos del producto
 * @returns {Promise<Object>} Respuesta del servidor
 */
const agregarProducto = async (producto) => {
  if (!producto) {
    throw new Error('Datos del producto requeridos');
  }

  try {
    const response = await axios.post(apiAgregarProducto, producto);
    _cacheProductos = { data: null, ts: 0 };

    return response.data;
  } catch (err) {
    console.error('Error agregarProducto:', err);
    throw err;
  }
};

// ============================================
// MODIFICAR PRODUCTO
// ============================================

/**
 * Modifica un producto existente
 * @param {Object} producto - Datos del producto actualizado
 * @returns {Promise<Object>} Respuesta del servidor
 */
const modificarProducto = async (producto) => {
  if (!producto || !producto.idProducto) {
    throw new Error('ID de producto requerido para modificar');
  }

  try {
    const response = await axios.post(apiModificarProducto, producto);
    _cacheProductos = { data: null, ts: 0 };

    return response.data;
  } catch (err) {
    console.error('Error modificarProducto:', err);
    throw err;
  }
};

// ============================================
// CAMBIAR ESTADO PRODUCTO
// ============================================

/**
 * Cambia el estado (activo/inactivo) de un producto
 * @param {number} idProducto - ID del producto
 * @param {boolean} esActivo - Nuevo estado
 * @param {string} usuario - Usuario que realiza el cambio
 * @param {number} identificador - Identificador de la empresa
 * @returns {Promise<Object>} Respuesta del servidor
 */
const cambiarEstadoProducto = async (idProducto, esActivo, usuario, identificador) => {
  if (!idProducto) {
    throw new Error('ID de producto requerido');
  }

  try {
    const response = await axios.post(apiModificarEstadoProducto, {
      idProducto,
      esActivo,
      usuario,
      identificador,
    });

    _cacheProductos = { data: null, ts: 0 };

    return response.data;
  } catch (err) {
    console.error('Error cambiarEstadoProducto:', err);
    throw err;
  }
};

// ============================================
// OBTENER PRODUCTOS POR TIPO (MT)
// ============================================

/**
 * Obtiene productos por empresa y tipo
 * @param {number} noEmpresa - Número de empresa
 * @param {number} noTipo - Número de tipo de producto
 * @returns {Promise<Array>} Lista de productos del tipo especificado
 */
const obtenerProductosMT = async (noEmpresa = 1, noTipo) => {
  if (!noTipo) {
    throw new Error('Tipo de producto requerido');
  }

  try {
    const response = await axios.get(`${apiObtenerProductosMT}/${noEmpresa}/${noTipo}`);

    if (response.status === 200) {
      const datos = response.data?.laListaDeProductos || [];
      return Array.isArray(datos) ? datos : [];
    }
    return [];
  } catch (err) {
    console.error('Error obtenerProductosMT:', err);
    throw err;
  }
};

// ============================================
// OBTENER PRODUCTOS POR DESCRIPCIÓN (AR)
// ============================================

/**
 * Obtiene productos por empresa y descripción
 * @param {number} noEmpresa - Número de empresa
 * @param {string} descripcion - Descripción a buscar
 * @returns {Promise<Array>} Lista de productos que coinciden
 */
const obtenerProductosAR = async (noEmpresa = 1, descripcion = '') => {
  if (!descripcion) {
    throw new Error('Descripción requerida');
  }

  try {
    const response = await axios.get(`${apiObtenerProductosAR}/${noEmpresa}/${descripcion}`);

    if (response.status === 200) {
      const datos = response.data?.laListaDeProductos || [];
      return Array.isArray(datos) ? datos : [];
    }
    return [];
  } catch (err) {
    console.error('Error obtenerProductosAR:', err);
    throw err;
  }
};

// ============================================
// ELIMINAR PRODUCTO
// ============================================

/**
 * Elimina un producto
 * @param {number} id - ID del producto
 * @returns {Promise<Object>} Respuesta del servidor
 */
const eliminarProducto = async (id) => {
  if (!id) {
    throw new Error('ID de producto requerido');
  }

  try {
    const response = await axios.delete(`${apiEliminarProducto}${id}`);
    _cacheProductos = { data: null, ts: 0 };

    return response.data;
  } catch (err) {
    console.error('Error eliminarProducto:', err);
    throw err;
  }
};

// ============================================
// LIMPIAR CACHÉ
// ============================================

const limpiarCacheProductos = () => {
  _cacheProductos = { data: null, ts: 0 };
};

export {
  obtenerListaDeProductos,
  obtenerProductoPorId,
  agregarProducto,
  modificarProducto,
  cambiarEstadoProducto,
  obtenerProductosMT,
  obtenerProductosAR,
  eliminarProducto,
  limpiarCacheProductos,
};
