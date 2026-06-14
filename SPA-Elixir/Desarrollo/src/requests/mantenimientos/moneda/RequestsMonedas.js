import axios from 'axios';
import {
    apiMonedas,
    apiMonedaPorId,
    apiCrearMoneda,
    apiCambiarEstadoMoneda,
} from './DireccionesRequest';

const axiosMonedas = axios.create();

axiosMonedas.interceptors.request.use(async (config) => {
    config.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    return config;
}, (error) => Promise.reject(error));

axiosMonedas.interceptors.response.use(
    (response) => response,
    (error) => {
        console.error('[MonedaAPI] Error:', error?.response?.status, error?.response?.data ?? error?.message);
        return Promise.reject(error);
    }
);

const obtenerListaDeMonedas = async () => {
    try {
        const respuesta = await axiosMonedas.get(apiMonedas);
        if (respuesta.status === 200) return respuesta.data;
        return { laListaDeMonedas: [], esCorrecto: false, mensaje: 'Respuesta inesperada' };
    } catch (e) {
        return { laListaDeMonedas: [], esCorrecto: false, mensaje: e?.response?.data?.mensaje ?? String(e) };
    }
};

/** PK relación moneda–sucursal (valor que debe persistir en proveedor como NoMoneda / FK). */
export const idMonedaDe = (m) => m?.idMoneda ?? m?.IdMoneda;

/** Número de moneda catálogo (solo descriptivo / búsqueda; no es el id de relación). */
export const numeroMonedaCatalogoDe = (m) => m?.numeroDeMoneda ?? m?.NumeroDeMoneda ?? m?.noMoneda ?? m?.NoMoneda;

export const descripcionMonedaDe = (m) => m?.descripcion ?? m?.Descripcion ?? '';

export const signoMonedaDe = (m) => m?.signo ?? m?.Signo ?? '';

export const labelMonedaDe = (m) => {
    if (!m) return '';
    const s = signoMonedaDe(m);
    const d = descripcionMonedaDe(m);
    const n = numeroMonedaCatalogoDe(m);
    const core = s && d ? `${s} — ${d}` : (d || s || String(n ?? ''));
    return n !== undefined && n !== null ? `${core}` : core;
};

/**
 * Lista desde respuesta (array o objeto con laListaDeMonedas / etc.).
 */
export const normalizarListaMonedas = (resp) => {
    if (!resp) return [];
    if (Array.isArray(resp)) return resp;
    const keys = ['laListaDeMonedas', 'LaListaDeMonedas', 'monedas', 'datos', 'data', 'Data'];
    for (let i = 0; i < keys.length; i += 1) {
        const arr = resp[keys[i]];
        if (Array.isArray(arr)) return arr;
    }
    return [];
};

const monedaEsActiva = (m) => {
    if (m?.activo !== undefined) return !!m.activo;
    if (m?.Activo !== undefined) return !!m.Activo;
    if (m?.esActivo !== undefined) return !!m.esActivo;
    if (m?.EsActivo !== undefined) return !!m.EsActivo;
    return true;
};

/**
 * GET /api/monedas?identificador=...
 * Si el servidor usa otra ruta, reintenta con ObtenerMonedasPorIdentificador.
 */
const obtenerMonedasPorGetIdentificador = async (identificador) => {
    try {
        const respuesta = await axiosMonedas.get(apiMonedas, {
            params: { identificador },
        });
        if (respuesta.status === 200) return respuesta.data;
        return obtenerMonedasPorIdentificador(identificador);
    } catch (e) {
        const st = e?.response?.status;
        if (st === 404 || st === 405) {
            return obtenerMonedasPorIdentificador(identificador);
        }
        return {
            laListaDeMonedas: [],
            esCorrecto: false,
            mensaje: e?.response?.data?.mensaje ?? String(e),
        };
    }
};

/**
 * GET /api/monedas/{idMoneda}
 */
const obtenerMonedaPorId = async (idMoneda) => {
    const urlApi = `${apiMonedaPorId}${idMoneda}`;
    try {
        const respuesta = await axiosMonedas.get(urlApi);
        if (respuesta.status === 200) return respuesta.data;
        return { datos: null, esCorrecto: false, mensaje: 'Respuesta inesperada' };
    } catch (e) {
        return { datos: null, esCorrecto: false, mensaje: e?.response?.data?.mensaje ?? String(e) };
    }
};

/**
 * GET /api/monedas/ObtenerMonedasPorIdentificador?identificador=X
 */
const obtenerMonedasPorIdentificador = async (identificador) => {
    const urlApi = `${apiMonedas}/ObtenerMonedasPorIdentificador?identificador=${identificador}`;
    try {
        const respuesta = await axiosMonedas.get(urlApi);
        if (respuesta.status === 200) {
            if (respuesta.data?.laListaDeMonedas?.length > 0) {
                console.log('[obtenerMonedasPorIdentificador] primer item:', respuesta.data.laListaDeMonedas[0]);
            }
            return respuesta.data;
        }
        return { laListaDeMonedas: [], esCorrecto: false, mensaje: 'Respuesta inesperada' };
    } catch (e) {
        return { laListaDeMonedas: [], esCorrecto: false, mensaje: e?.response?.data?.mensaje ?? String(e) };
    }
};

/**
 * POST /api/monedas
 * Body: { numeroDeMoneda, identificador, usuario }
 */
const crearMoneda = async ({ numeroDeMoneda, identificador, usuario }) => {
    try {
        const respuesta = await axiosMonedas.post(apiCrearMoneda, { numeroDeMoneda, identificador, usuario });
        if (respuesta.status === 200 || respuesta.status === 201) return respuesta.data;
        return { mensaje: 'Respuesta inesperada', esCorrecto: false };
    } catch (e) {
        return { mensaje: e?.response?.data?.mensaje ?? String(e), esCorrecto: false };
    }
};

/**
 * POST /api/monedas/{idMoneda}/estado
 * Body: { activo: bool, usuario: string }
 * Nota: idMoneda es el ID de la relación moneda-sucursal (numeroDeMoneda del DTO)
 */
const cambiarEstadoMoneda = async (idMoneda, activo, usuario) => {
    const urlApi = `${apiCambiarEstadoMoneda}${idMoneda}/estado`;
    console.log('[cambiarEstadoMoneda] POST', urlApi, { activo, usuario });
    if (!idMoneda) {
        console.error('[cambiarEstadoMoneda] idMoneda es undefined/null — verificar que el backend incluye idMoneda en el DTO de respuesta');
        return { mensaje: 'Error interno: ID de relación no disponible', esCorrecto: false };
    }
    try {
        const respuesta = await axiosMonedas.post(urlApi, { activo, usuario });
        if (respuesta.status === 200) return respuesta.data;
        return { mensaje: 'Respuesta inesperada', esCorrecto: false };
    } catch (e) {
        return { mensaje: e?.response?.data?.mensaje ?? String(e), esCorrecto: false };
    }
};

export {
    obtenerListaDeMonedas,
    obtenerMonedaPorId,
    obtenerMonedasPorIdentificador,
    obtenerMonedasPorGetIdentificador,
    crearMoneda,
    cambiarEstadoMoneda,
};

/** Solo monedas marcadas activas (si el DTO trae el campo). */
export const filtrarMonedasActivas = (lista) => lista.filter(monedaEsActiva);

