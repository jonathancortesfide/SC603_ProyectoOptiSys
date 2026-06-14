import axios from 'axios';
import { apiMarcas, apiModificaEstadoMarca } from './DireccionesRequest';

/** Sin timeout axios puede quedar pendiente si el API no responde (pantalla de carga infinita). */
const timeoutMarcasMs = (() => {
    const raw = import.meta.env.VITE_API_TIMEOUT_MARCAS_MS ?? import.meta.env.VITE_API_TIMEOUT_MS;
    const n = Number.parseInt(String(raw ?? ''), 10);
    return Number.isFinite(n) && n > 0 ? n : 60000;
})();

const axiosMarcas = axios.create({ timeout: timeoutMarcasMs });

axiosMarcas.interceptors.request.use(async (config) => {
    config.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    return config;
}, (error) => Promise.reject(error));

axiosMarcas.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('[MarcasAPI] Error:', error?.response?.status, error?.response?.data ?? error?.message);
        return Promise.reject(error);
    },
);

export const noMarcaDe = (m) => m?.noMarca ?? m?.NoMarca ?? m?.id ?? m?.Id;

export const esActivoMarca = (m) => {
    if (m?.esActivo !== undefined) return !!m.esActivo;
    if (m?.EsActivo !== undefined) return !!m.EsActivo;
    if (m?.activo !== undefined) return !!m.activo;
    if (m?.Activo !== undefined) return !!m.Activo;
    return true;
};

export const descripcionMarcaDe = (m) => m?.descripcion ?? m?.Descripcion ?? '';

export const normalizarListaMarcas = (resp) => {
    if (!resp) return [];
    const keys = ['LaListaDeMarcas', 'laListaDeMarcas', 'listaMarcas', 'marcas', 'datos', 'data', 'Data'];
    for (let i = 0; i < keys.length; i += 1) {
        const k = keys[i];
        const v = resp[k];
        if (v !== undefined && Array.isArray(v)) return v;
    }
    if (Array.isArray(resp)) return resp;
    return [];
};

const mensajeError = (e) => e?.response?.data?.mensaje
    ?? e?.response?.data?.Mensaje
    ?? String(e);

const mockListaMarcas = () => [
    { NoMarca: 1, Descripcion: 'Oakley', EsActivo: true, NoEmpresa: 7 },
    { NoMarca: 2, Descripcion: 'Ray-Ban', EsActivo: true, NoEmpresa: 7 },
];

/**
 * POST .../Marcas/ObtenerMarca
 * Cuerpo: { NoEmpresa, Descripcion }
 */
const obtenerMarcas = async (noEmpresa, descripcion = '') => {
    const url = `${apiMarcas}/ObtenerMarca`;
    try {
        const respuesta = await axiosMarcas.post(url, {
            NoEmpresa: Number.parseInt(String(noEmpresa), 10) || 0,
            Descripcion: descripcion != null ? String(descripcion) : '',
        });
        if (respuesta.status === 200) return respuesta.data;
        return { LaListaDeMarcas: [], EsCorrecto: false, Mensaje: 'Respuesta inesperada' };
    } catch (e) {
        const usarMock = import.meta.env.VITE_USE_MOCK === 'true';
        if (usarMock) {
            console.warn('[MarcasAPI] Usando lista mock (error o timeout):', mensajeError(e));
            return {
                LaListaDeMarcas: mockListaMarcas(),
                EsCorrecto: true,
                Mensaje: '',
            };
        }
        return { LaListaDeMarcas: [], EsCorrecto: false, Mensaje: mensajeError(e) };
    }
};

/**
 * Lista en memoria: útil cuando la fila no trae todos los campos del DTO.
 */
const obtenerMarcaPorNoMarca = async (noEmpresa, noMarca) => {
    const resp = await obtenerMarcas(noEmpresa, '');
    const lista = normalizarListaMarcas(resp);
    const n = Number.parseInt(String(noMarca), 10);
    return lista.find((x) => Number(noMarcaDe(x)) === n) ?? null;
};

/**
 * POST .../Marcas/AgregarMarca
 */
const agregarMarca = async (payload) => {
    const urlApi = `${apiMarcas}/AgregarMarca`;
    try {
        const respuesta = await axiosMarcas.post(urlApi, payload);
        if (respuesta.status === 200) return respuesta.data;
        return { Mensaje: 'Respuesta inesperada', EsCorrecto: false };
    } catch (e) {
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { Mensaje: 'Marca creada (mock)', EsCorrecto: true };
        }
        return { Mensaje: mensajeError(e), EsCorrecto: false };
    }
};

/**
 * POST .../Marcas/ModificarMarca
 */
const modificarMarca = async (payload) => {
    const urlApi = `${apiMarcas}/ModificarMarca`;
    try {
        const respuesta = await axiosMarcas.post(urlApi, payload);
        if (respuesta.status === 200) return respuesta.data;
        return { Mensaje: 'Respuesta inesperada', EsCorrecto: false };
    } catch (e) {
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { Mensaje: 'Marca actualizada (mock)', EsCorrecto: true };
        }
        return { Mensaje: mensajeError(e), EsCorrecto: false };
    }
};

/**
 * POST .../Marcas/ModificaEstadoMarca
 * Cuerpo (camelCase, como proveedor): { noMarca, usuario, esActivo, identificador }
 */
const modificarEstadoMarca = async (payload) => {
    const urlApi = (apiModificaEstadoMarca && String(apiModificaEstadoMarca).trim())
        ? String(apiModificaEstadoMarca).trim()
        : `${apiMarcas}/ModificaEstadoMarca`;
    try {
        const respuesta = await axiosMarcas.post(urlApi, payload);
        if (respuesta.status === 200) return respuesta.data;
        return { Mensaje: 'Respuesta inesperada', EsCorrecto: false };
    } catch (e) {
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { Mensaje: 'Estado actualizado (mock)', EsCorrecto: true };
        }
        return { Mensaje: mensajeError(e), EsCorrecto: false };
    }
};

export {
    obtenerMarcas,
    obtenerMarcaPorNoMarca,
    agregarMarca,
    modificarMarca,
    modificarEstadoMarca,
};
