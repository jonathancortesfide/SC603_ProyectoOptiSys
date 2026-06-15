import axios from 'axios';
import { apiPaises } from './DireccionesRequest';

const axiosPaises = axios.create();

axiosPaises.interceptors.request.use(async (config) => {
    config.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    return config;
}, (error) => Promise.reject(error));

axiosPaises.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('[PaisAPI] Error:', error?.response?.status, error?.response?.data ?? error?.message);
        return Promise.reject(error);
    }
);

/** PK en API (noPais / NoPais) */
export const noPaisDe = (p) => p?.noPais ?? p?.NoPais;

export const nombrePaisDe = (p) => p?.nombre ?? p?.Nombre ?? '';

/**
 * Normaliza la lista desde la respuesta del API (PaisConModeloDeValidacion).
 */
export const normalizarListaPaises = (resp) => {
    if (!resp) return [];
    if (Array.isArray(resp)) return resp;
    const keys = ['laListaDePaises', 'LaListaDePaises', 'paises', 'datos', 'data', 'Data'];
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
 * POST .../Paises/ObtenerPais
 * @param {string} nombre - Filtro opcional; cadena vacía = todos.
 */
const obtenerPaises = async (nombre = '') => {
    const url = `${apiPaises}/ObtenerPais`;
    try {
        const respuesta = await axiosPaises.post(url, { nombre: nombre ?? '' });
        if (respuesta.status === 200) return respuesta.data;
        return { laListaDePaises: [], esCorrecto: false, mensaje: 'Respuesta inesperada' };
    } catch (e) {
        return { laListaDePaises: [], esCorrecto: false, mensaje: mensajeError(e) };
    }
};

export { obtenerPaises };
