import axios from 'axios';
import {
    apiClasificacionesPacientesPorEmpresa,
    apiCrearClasificacionPaciente,
    apiActualizarClasificacionPaciente,
    apiCambiarEstadoClasificacionPaciente,
} from './DireccionesRequest';

axios.interceptors.request.use(async (config) => {
    const token = window.localStorage.getItem('accessToken');

    config.headers = {
        ...(config.headers || {}),
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };
    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(async (response) => response, function (error) {
    return Promise.reject(error);
});

const respuestaError = (mensaje) => ({ esCorrecto: false, mensaje });

const obtenerListaDeClasificacionesPacientes = async (noEmpresa) => {
    const urlApi = `${apiClasificacionesPacientesPorEmpresa}${noEmpresa}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al obtener lista de clasificaciones de pacientes: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return {
                        esCorrecto: true,
                        mensaje: '',
                        laListaDeClasificaciones: [
                            { no_clasificacion: 1, descripcion: 'Prioritario', no_empresa: Number(noEmpresa), activo: true },
                            { no_clasificacion: 2, descripcion: 'Control', no_empresa: Number(noEmpresa), activo: true },
                            { no_clasificacion: 3, descripcion: 'Seguimiento', no_empresa: Number(noEmpresa), activo: false }
                        ]
                    };
                }
                return respuestaError('No se pudo obtener la lista de clasificaciones de pacientes');
            });
    } catch (error) {
        console.log('Error en obtenerListaDeClasificacionesPacientes: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return {
                esCorrecto: true,
                mensaje: '',
                laListaDeClasificaciones: [
                    { no_clasificacion: 1, descripcion: 'Prioritario', no_empresa: Number(noEmpresa), activo: true },
                    { no_clasificacion: 2, descripcion: 'Control', no_empresa: Number(noEmpresa), activo: true },
                    { no_clasificacion: 3, descripcion: 'Seguimiento', no_empresa: Number(noEmpresa), activo: false }
                ]
            };
        }
        return respuestaError('No se pudo obtener la lista de clasificaciones de pacientes');
    }
};

const crearClasificacionPaciente = async (clasificacion) => {
    const urlApi = `${apiCrearClasificacionPaciente}`;
    let dataRespuesta = respuestaError('Hubo un problema al crear la clasificación');
    try {
        return axios.post(urlApi, clasificacion)
            .then(respuesta => {
                if (respuesta.status === 200 || respuesta.status === 201) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al crear clasificación de pacientes: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { esCorrecto: true, mensaje: 'Clasificación creada (mock)' };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en crearClasificacionPaciente: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { esCorrecto: true, mensaje: 'Clasificación creada (mock)' };
        }
        return dataRespuesta;
    }
};

const actualizarClasificacionPaciente = async (clasificacion) => {
    const urlApi = `${apiActualizarClasificacionPaciente}`;
    let dataRespuesta = respuestaError('Hubo un problema al actualizar la clasificación');
    try {
        return axios.post(urlApi, clasificacion)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al actualizar clasificación de pacientes: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { esCorrecto: true, mensaje: 'Clasificación actualizada (mock)' };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en actualizarClasificacionPaciente: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { esCorrecto: true, mensaje: 'Clasificación actualizada (mock)' };
        }
        return dataRespuesta;
    }
};

const cambiarEstadoClasificacionPaciente = async (id, activo, usuario) => {
    const urlApi = `${apiCambiarEstadoClasificacionPaciente}${id}/estado`;
    let dataRespuesta = respuestaError('Hubo un problema al cambiar el estado de la clasificación');
    try {
        return axios.post(urlApi, { activo, usuario })
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al cambiar estado de clasificación de pacientes: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { esCorrecto: true, mensaje: 'Estado actualizado (mock)' };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en cambiarEstadoClasificacionPaciente: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { esCorrecto: true, mensaje: 'Estado actualizado (mock)' };
        }
        return dataRespuesta;
    }
};

export {
    obtenerListaDeClasificacionesPacientes,
    crearClasificacionPaciente,
    actualizarClasificacionPaciente,
    cambiarEstadoClasificacionPaciente
};
