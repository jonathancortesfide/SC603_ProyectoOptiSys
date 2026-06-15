import axios from 'axios';
import {
    apiProveedores,
    apiModificarEstadoProveedor,
} from './DireccionesRequest';

const axiosProveedores = axios.create();

axiosProveedores.interceptors.request.use(async (config) => {
    config.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    return config;
}, (error) => Promise.reject(error));

axiosProveedores.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('[ProveedorAPI] Error:', error?.response?.status, error?.response?.data ?? error?.message);
        return Promise.reject(error);
    }
);

/** PK del proveedor en API / SP (NoProveedor) */
export const noProveedorDe = (p) => p?.noProveedor ?? p?.NoProveedor ?? p?.idProveedor ?? p?.IdProveedor ?? p?.id ?? p?.Id;

/** @deprecated usar noProveedorDe */
export const idProveedorDe = noProveedorDe;

export const normalizarListaProveedores = (resp) => {
    if (!resp) return [];
    if (Array.isArray(resp)) return resp;
    const keys = ['laListaDeProveedores', 'listaProveedores', 'proveedores', 'datos', 'data', 'Data'];
    for (let i = 0; i < keys.length; i += 1) {
        const k = keys[i];
        const v = resp[k];
        if (v !== undefined && Array.isArray(v)) return v;
    }
    return [];
};

const mensajeError = (e) => e?.response?.data?.mensaje
    ?? e?.response?.data?.Mensaje
    ?? String(e);

/**
 * POST .../Proveedores/ObtenerProveedor
 * Cuerpo: { identificador }
 */
const obtenerProveedores = async (identificador) => {
    const url = `${apiProveedores}/ObtenerProveedor`;
    try {
        const respuesta = await axiosProveedores.post(url, { identificador });
        if (respuesta.status === 200) return respuesta.data;
        return { lista: [], esCorrecto: false, mensaje: 'Respuesta inesperada' };
    } catch (e) {
        return { lista: [], esCorrecto: false, mensaje: mensajeError(e) };
    }
};

/**
 * POST .../Proveedores/AgregarProveedor
 */
const agregarProveedor = async (payload) => {
    const urlApi = `${apiProveedores}/AgregarProveedor`;
    try {
        const respuesta = await axiosProveedores.post(urlApi, payload);
        if (respuesta.status === 200 || respuesta.status === 201) return respuesta.data;
        return { mensaje: 'Respuesta inesperada', esCorrecto: false };
    } catch (e) {
        return { mensaje: mensajeError(e), esCorrecto: false };
    }
};

/**
 * POST .../Proveedores/ActualizarProveedor
 */
const actualizarProveedor = async (payload) => {
    const urlApi = `${apiProveedores}/ActualizarProveedor`;
    try {
        const respuesta = await axiosProveedores.post(urlApi, payload);
        if (respuesta.status === 200) return respuesta.data;
        return { mensaje: 'Respuesta inesperada', esCorrecto: false };
    } catch (e) {
        return { mensaje: mensajeError(e), esCorrecto: false };
    }
};

/**
 * POST .../Proveedores/ModificaEstadoProveedor
 * Cuerpo (camelCase): { noProveedor, usuario, esActivo, identificador }
 *
 * Opcional .env: VITE_ApiModificarEstadoProveedor=/api/Proveedores/ModificaEstadoProveedor
 */
const modificarEstadoProveedor = async (payload) => {
    const urlApi = (apiModificarEstadoProveedor && String(apiModificarEstadoProveedor).trim())
        ? String(apiModificarEstadoProveedor).trim()
        : `${apiProveedores}/ModificaEstadoProveedor`;
    try {
        const respuesta = await axiosProveedores.post(urlApi, payload);
        if (respuesta.status === 200) return respuesta.data;
        return { mensaje: 'Respuesta inesperada', esCorrecto: false };
    } catch (e) {
        const detalle = urlApi ? ` (${urlApi})` : '';
        return { mensaje: `${mensajeError(e)}${detalle}`, esCorrecto: false };
    }
};

export {
    obtenerProveedores,
    agregarProveedor,
    actualizarProveedor,
    modificarEstadoProveedor,
};
