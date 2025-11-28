import axios from 'axios';
import {
    apiMonedas,
    apiMonedaPorId,
    apiCrearMoneda,
    apiActualizarMoneda,
    apiEliminarMoneda,
} from './DireccionesRequest';

axios.interceptors.request.use(async (config) => {
    config.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    };
    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(async (response) => response, function (error) {
    return Promise.reject(error);
});

const obtenerListaDeMonedas = async () => {
    const urlApi = `${apiMonedas}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al obtener lista de monedas: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return [
                        { id: 'm-001', descripcion: 'Dolares', signo: '$', abreviatura: 'USD' },
                        { id: 'm-002', descripcion: 'Euros', signo: '€', abreviatura: 'EUR' }
                    ];
                }
                return [];
            });
    } catch (error) {
        console.log('Error en obtenerListaDeMonedas: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return [
                { id: 'm-001', descripcion: 'Dolares', signo: '$', abreviatura: 'USD' },
                { id: 'm-002', descripcion: 'Euros', signo: '€', abreviatura: 'EUR' }
            ];
        }
        return [];
    }
};

const obtenerMonedaPorId = async (id) => {
    const urlApi = `${apiMonedaPorId}${id}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al obtener moneda: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { id: 'm-001', descripcion: 'Dolares', signo: '$', abreviatura: 'USD' };
                }
                return null;
            });
    } catch (error) {
        console.log('Error en obtenerMonedaPorId: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { id: 'm-001', descripcion: 'Dolares', signo: '$', abreviatura: 'USD' };
        }
        return null;
    }
};

const crearMoneda = async (moneda) => {
    const urlApi = `${apiCrearMoneda}`;
    let dataRespuesta = { Mensaje: 'Hubo un problema con la promesa', EsCorrecto: false, Data: null };
    try {
        return axios.post(urlApi, moneda)
            .then(respuesta => {
                if (respuesta.status === 200 || respuesta.status === 201) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al crear moneda: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { Mensaje: 'Moneda creada (mock)', EsCorrecto: true, Data: { ...moneda, id: 'm-mock-' + Date.now() } };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en crearMoneda: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { Mensaje: 'Moneda creada (mock)', EsCorrecto: true, Data: { ...moneda, id: 'm-mock-' + Date.now() } };
        }
        return dataRespuesta;
    }
};

const actualizarMoneda = async (id, moneda) => {
    const urlApi = `${apiActualizarMoneda}${id}`;
    let dataRespuesta = { Mensaje: 'Hubo un problema con la promesa', EsCorrecto: false, Data: null };
    try {
        return axios.put(urlApi, moneda)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al actualizar moneda: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { Mensaje: 'Moneda actualizada (mock)', EsCorrecto: true, Data: { id, ...moneda } };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en actualizarMoneda: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { Mensaje: 'Moneda actualizada (mock)', EsCorrecto: true, Data: { id, ...moneda } };
        }
        return dataRespuesta;
    }
};

const eliminarMoneda = async (id) => {
    const urlApi = `${apiEliminarMoneda}${id}`;
    let dataRespuesta = { Mensaje: 'Hubo un problema con la promesa', EsCorrecto: false };
    try {
        return axios.delete(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al eliminar moneda: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { Mensaje: 'Moneda eliminada (mock)', EsCorrecto: true };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en eliminarMoneda: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { Mensaje: 'Moneda eliminada (mock)', EsCorrecto: true };
        }
        return dataRespuesta;
    }
};

export {
    obtenerListaDeMonedas,
    obtenerMonedaPorId,
    crearMoneda,
    actualizarMoneda,
    eliminarMoneda
};
