import axios from 'axios';
import {
    apiGruposProductos,
    apiGrupoProductoPorId,
    apiCrearGrupoProducto,
    apiActualizarGrupoProducto,
    apiEliminarGrupoProducto,
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

const obtenerListaDeGruposProductos = async () => {
    const urlApi = `${apiGruposProductos}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al obtener lista de grupos de productos: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return [
                        { id: 'gp-001', descripcion: 'Lentes' },
                        { id: 'gp-002', descripcion: 'Accesorios' },
                        { id: 'gp-003', descripcion: 'Armazones' }
                    ];
                }
                return [];
            });
    } catch (error) {
        console.log('Error en obtenerListaDeGruposProductos: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return [
                { id: 'gp-001', descripcion: 'Lentes' },
                { id: 'gp-002', descripcion: 'Accesorios' },
                { id: 'gp-003', descripcion: 'Armazones' }
            ];
        }
        return [];
    }
};

const obtenerGrupoProductoPorId = async (id) => {
    const urlApi = `${apiGrupoProductoPorId}${id}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al obtener grupo de productos: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { id: 'gp-001', descripcion: 'Lentes' };
                }
                return null;
            });
    } catch (error) {
        console.log('Error en obtenerGrupoProductoPorId: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { id: 'gp-001', descripcion: 'Lentes' };
        }
        return null;
    }
};

const crearGrupoProducto = async (grupo) => {
    const urlApi = `${apiCrearGrupoProducto}`;
    let dataRespuesta = { Mensaje: 'Hubo un problema con la promesa', EsCorrecto: false, Data: null };
    try {
        return axios.post(urlApi, grupo)
            .then(respuesta => {
                if (respuesta.status === 200 || respuesta.status === 201) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al crear grupo de productos: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { Mensaje: 'Grupo creado (mock)', EsCorrecto: true, Data: { ...grupo, id: 'gp-mock-' + Date.now() } };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en crearGrupoProducto: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { Mensaje: 'Grupo creado (mock)', EsCorrecto: true, Data: { ...grupo, id: 'gp-mock-' + Date.now() } };
        }
        return dataRespuesta;
    }
};

const actualizarGrupoProducto = async (id, grupo) => {
    const urlApi = `${apiActualizarGrupoProducto}${id}`;
    let dataRespuesta = { Mensaje: 'Hubo un problema con la promesa', EsCorrecto: false, Data: null };
    try {
        return axios.put(urlApi, grupo)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al actualizar grupo de productos: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { Mensaje: 'Grupo actualizado (mock)', EsCorrecto: true, Data: { id, ...grupo } };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en actualizarGrupoProducto: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { Mensaje: 'Grupo actualizado (mock)', EsCorrecto: true, Data: { id, ...grupo } };
        }
        return dataRespuesta;
    }
};

const eliminarGrupoProducto = async (id) => {
    const urlApi = `${apiEliminarGrupoProducto}${id}`;
    let dataRespuesta = { Mensaje: 'Hubo un problema con la promesa', EsCorrecto: false };
    try {
        return axios.delete(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al eliminar grupo de productos: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { Mensaje: 'Grupo eliminado (mock)', EsCorrecto: true };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en eliminarGrupoProducto: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { Mensaje: 'Grupo eliminado (mock)', EsCorrecto: true };
        }
        return dataRespuesta;
    }
};

export {
    obtenerListaDeGruposProductos,
    obtenerGrupoProductoPorId,
    crearGrupoProducto,
    actualizarGrupoProducto,
    eliminarGrupoProducto
};
