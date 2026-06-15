import axios from 'axios';
import {
    apiClasificacionesPacientes,
    apiClasificacionPacientePorId,
    apiCrearClasificacionPaciente,
    apiActualizarClasificacionPaciente,
    apiEliminarClasificacionPaciente,
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

const obtenerListaDeClasificacionesPacientes = async () => {
    const urlApi = `${apiClasificacionesPacientes}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al obtener lista de clasificaciones de pacientes: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return [
                        { id: 'cp-001', descripcion: 'Prioritario' },
                        { id: 'cp-002', descripcion: 'Control' },
                        { id: 'cp-003', descripcion: 'Seguimiento' }
                    ];
                }
                return [];
            });
    } catch (error) {
        console.log('Error en obtenerListaDeClasificacionesPacientes: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return [
                { id: 'cp-001', descripcion: 'Prioritario' },
                { id: 'cp-002', descripcion: 'Control' },
                { id: 'cp-003', descripcion: 'Seguimiento' }
            ];
        }
        return [];
    }
};

const obtenerClasificacionPacientePorId = async (id) => {
    const urlApi = `${apiClasificacionPacientePorId}${id}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al obtener clasificación de pacientes: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { id: 'cp-001', descripcion: 'Prioritario' };
                }
                return null;
            });
    } catch (error) {
        console.log('Error en obtenerClasificacionPacientePorId: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { id: 'cp-001', descripcion: 'Prioritario' };
        }
        return null;
    }
};

const crearClasificacionPaciente = async (clasificacion) => {
    const urlApi = `${apiCrearClasificacionPaciente}`;
    let dataRespuesta = { Mensaje: 'Hubo un problema con la promesa', EsCorrecto: false, Data: null };
    try {
        return axios.post(urlApi, clasificacion)
            .then(respuesta => {
                if (respuesta.status === 200 || respuesta.status === 201) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al crear clasificación de pacientes: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { Mensaje: 'Clasificación creada (mock)', EsCorrecto: true, Data: { ...clasificacion, id: 'cp-mock-' + Date.now() } };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en crearClasificacionPaciente: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { Mensaje: 'Clasificación creada (mock)', EsCorrecto: true, Data: { ...clasificacion, id: 'cp-mock-' + Date.now() } };
        }
        return dataRespuesta;
    }
};

const actualizarClasificacionPaciente = async (id, clasificacion) => {
    const urlApi = `${apiActualizarClasificacionPaciente}${id}`;
    let dataRespuesta = { Mensaje: 'Hubo un problema con la promesa', EsCorrecto: false, Data: null };
    try {
        return axios.put(urlApi, clasificacion)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al actualizar clasificación de pacientes: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { Mensaje: 'Clasificación actualizada (mock)', EsCorrecto: true, Data: { id, ...clasificacion } };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en actualizarClasificacionPaciente: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { Mensaje: 'Clasificación actualizada (mock)', EsCorrecto: true, Data: { id, ...clasificacion } };
        }
        return dataRespuesta;
    }
};

const eliminarClasificacionPaciente = async (id) => {
    const urlApi = `${apiEliminarClasificacionPaciente}${id}`;
    let dataRespuesta = { Mensaje: 'Hubo un problema con la promesa', EsCorrecto: false };
    try {
        return axios.delete(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al eliminar clasificación de pacientes: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { Mensaje: 'Clasificación eliminada (mock)', EsCorrecto: true };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en eliminarClasificacionPaciente: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { Mensaje: 'Clasificación eliminada (mock)', EsCorrecto: true };
        }
        return dataRespuesta;
    }
};

export {
    obtenerListaDeClasificacionesPacientes,
    obtenerClasificacionPacientePorId,
    crearClasificacionPaciente,
    actualizarClasificacionPaciente,
    eliminarClasificacionPaciente
};
