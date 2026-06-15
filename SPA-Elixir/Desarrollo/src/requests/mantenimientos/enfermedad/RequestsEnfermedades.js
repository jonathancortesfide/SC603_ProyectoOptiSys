import axios from 'axios';
import {
    apiEnfermedades,
    apiTiposEnfermedades,
    apiCatalogoEnfermedades,
    apiAgregarEnfermedadConCatalogo,
    apiCambiarEstadoEnfermedad,
} from './DireccionesRequest';

const axiosEnfermedades = axios.create();

axiosEnfermedades.interceptors.request.use(async (config) => {
    config.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    return config;
}, (error) => Promise.reject(error));

axiosEnfermedades.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('[EnfermedadAPI] Error:', error?.response?.status, error?.response?.data ?? error?.message);
        return Promise.reject(error);
    }
);

const normalizeListaResponse = (data, fallbackMessage = 'Respuesta inesperada') => ({
    datos: Array.isArray(data?.datos) ? data.datos : [],
    mensaje: data?.modeloValidacion?.mensaje ?? data?.mensaje ?? fallbackMessage,
    esCorrecto: data?.modeloValidacion?.esCorrecto ?? data?.esCorrecto ?? false,
});

const normalizeEstadoResponse = (data, fallbackMessage = 'Respuesta inesperada') => ({
    mensaje: data?.mensaje ?? data?.modeloValidacion?.mensaje ?? fallbackMessage,
    esCorrecto: data?.esCorrecto ?? data?.modeloValidacion?.esCorrecto ?? false,
});

const normalizeCatalogoResponse = (data) => (Array.isArray(data) ? data : []);
const normalizeTiposResponse = (data) => (Array.isArray(data) ? data : []);

const obtenerEnfermedades = async (identificador) => {
    const urlApi = identificador === undefined || identificador === null
        ? apiEnfermedades
        : `${apiEnfermedades}?${new URLSearchParams({ identificador: String(identificador) }).toString()}`;

    try {
        const respuesta = await axiosEnfermedades.get(urlApi);
        if (respuesta.status === 200) return normalizeListaResponse(respuesta.data);
        return normalizeListaResponse(null);
    } catch (e) {
        return {
            datos: [],
            mensaje: e?.response?.data?.modeloValidacion?.mensaje ?? e?.response?.data?.mensaje ?? String(e),
            esCorrecto: false,
        };
    }
};

const obtenerEnfermedadesPorIdentificador = async (identificador) => {
    const urlApi = `${apiEnfermedades}?${new URLSearchParams({ identificador: String(identificador) }).toString()}`;

    try {
        const respuesta = await axiosEnfermedades.get(urlApi);
        if (respuesta.status === 200) return normalizeListaResponse(respuesta.data);
        return normalizeListaResponse(null);
    } catch (e) {
        return {
            datos: [],
            mensaje: e?.response?.data?.modeloValidacion?.mensaje ?? e?.response?.data?.mensaje ?? String(e),
            esCorrecto: false,
        };
    }
};

const obtenerCatalogoEnfermedades = async () => {
    try {
        const respuesta = await axiosEnfermedades.get(apiCatalogoEnfermedades);
        if (respuesta.status === 200) return normalizeCatalogoResponse(respuesta.data);
        return [];
    } catch (e) {
        console.error('[obtenerCatalogoEnfermedades] Error:', e?.response?.data ?? e?.message);
        return [];
    }
};

const obtenerTiposEnfermedades = async () => {
    try {
        const respuesta = await axiosEnfermedades.get(apiTiposEnfermedades);
        if (respuesta.status === 200) return normalizeTiposResponse(respuesta.data);
        return [];
    } catch (e) {
        console.error('[obtenerTiposEnfermedades] Error:', e?.response?.data ?? e?.message);
        return [];
    }
};

const crearEnfermedad = async ({ idEnfermedad, identificador, usuario }) => {
    try {
        const respuesta = await axiosEnfermedades.post(apiEnfermedades, { idEnfermedad, identificador, usuario });
        if (respuesta.status === 200 || respuesta.status === 201) return normalizeEstadoResponse(respuesta.data);
        return normalizeEstadoResponse(null);
    } catch (e) {
        return {
            mensaje: e?.response?.data?.mensaje ?? e?.response?.data?.modeloValidacion?.mensaje ?? String(e),
            esCorrecto: false,
        };
    }
};

const crearEnfermedadCatalogo = async ({ descripcion, noTipo, usuario }) => {
    try {
        const respuesta = await axiosEnfermedades.post(apiCatalogoEnfermedades, { descripcion, noTipo, usuario });
        if (respuesta.status === 200 || respuesta.status === 201) return normalizeEstadoResponse(respuesta.data);
        return normalizeEstadoResponse(null);
    } catch (e) {
        return {
            mensaje: e?.response?.data?.mensaje ?? e?.response?.data?.modeloValidacion?.mensaje ?? String(e),
            esCorrecto: false,
        };
    }
};

const agregarEnfermedadConCatalogo = async ({ idEnfermedad = null, descripcion = '', noTipo = null, identificador, usuario }) => {
    const payload = {
        idEnfermedad,
        descripcion,
        noTipo,
        identificador,
        usuario,
    };

    try {
        const respuesta = await axiosEnfermedades.post(apiAgregarEnfermedadConCatalogo, payload);
        if (respuesta.status === 200 || respuesta.status === 201) return normalizeEstadoResponse(respuesta.data);
        return normalizeEstadoResponse(null);
    } catch (e) {
        return {
            mensaje: e?.response?.data?.mensaje ?? e?.response?.data?.modeloValidacion?.mensaje ?? String(e),
            esCorrecto: false,
        };
    }
};

const cambiarEstadoEnfermedad = async (numeroEnfermedad, activo, usuario) => {
    if (!numeroEnfermedad) {
        return { mensaje: 'Error interno: número de enfermedad no disponible', esCorrecto: false };
    }

    const urlApi = `${apiCambiarEstadoEnfermedad}${numeroEnfermedad}/estado`;

    try {
        const respuesta = await axiosEnfermedades.post(urlApi, { activo, usuario });
        if (respuesta.status === 200) return normalizeEstadoResponse(respuesta.data);
        return normalizeEstadoResponse(null);
    } catch (e) {
        return {
            mensaje: e?.response?.data?.mensaje ?? e?.response?.data?.modeloValidacion?.mensaje ?? String(e),
            esCorrecto: false,
        };
    }
};

export {
    obtenerEnfermedades,
    obtenerEnfermedadesPorIdentificador,
    obtenerCatalogoEnfermedades,
    obtenerTiposEnfermedades,
    crearEnfermedad,
    crearEnfermedadCatalogo,
    agregarEnfermedadConCatalogo,
    cambiarEstadoEnfermedad,
};