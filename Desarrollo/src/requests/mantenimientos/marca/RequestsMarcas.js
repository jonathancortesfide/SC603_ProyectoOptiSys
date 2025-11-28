import axios from 'axios';
import {
    apiMarcas,
    apiMarcaPorId,
    apiCrearMarca,
    apiActualizarMarca,
    apiEliminarMarca,
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

const obtenerListaDeMarcas = async () => {
    const urlApi = `${apiMarcas}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al obtener lista de marcas: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return [
                        { id: 'b-001', descripcion: 'Oakley' },
                        { id: 'b-002', descripcion: 'Ray-Ban' }
                    ];
                }
                return [];
            });
    } catch (error) {
        console.log('Error en obtenerListaDeMarcas: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return [
                { id: 'b-001', descripcion: 'Oakley' },
                { id: 'b-002', descripcion: 'Ray-Ban' }
            ];
        }
        return [];
    }
};

const obtenerMarcaPorId = async (id) => {
    const urlApi = `${apiMarcaPorId}${id}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al obtener marca: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { id: 'b-001', descripcion: 'Oakley' };
                }
                return null;
            });
    } catch (error) {
        console.log('Error en obtenerMarcaPorId: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { id: 'b-001', descripcion: 'Oakley' };
        }
        return null;
    }
};

const crearMarca = async (marca) => {
    const urlApi = `${apiCrearMarca}`;
    let dataRespuesta = { Mensaje: 'Hubo un problema con la promesa', EsCorrecto: false, Data: null };
    try {
        return axios.post(urlApi, marca)
            .then(respuesta => {
                if (respuesta.status === 200 || respuesta.status === 201) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al crear marca: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { Mensaje: 'Marca creada (mock)', EsCorrecto: true, Data: { ...marca, id: 'b-mock-' + Date.now() } };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en crearMarca: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { Mensaje: 'Marca creada (mock)', EsCorrecto: true, Data: { ...marca, id: 'b-mock-' + Date.now() } };
        }
        return dataRespuesta;
    }
};

const actualizarMarca = async (id, marca) => {
    const urlApi = `${apiActualizarMarca}${id}`;
    let dataRespuesta = { Mensaje: 'Hubo un problema con la promesa', EsCorrecto: false, Data: null };
    try {
        return axios.put(urlApi, marca)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al actualizar marca: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { Mensaje: 'Marca actualizada (mock)', EsCorrecto: true, Data: { id, ...marca } };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en actualizarMarca: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { Mensaje: 'Marca actualizada (mock)', EsCorrecto: true, Data: { id, ...marca } };
        }
        return dataRespuesta;
    }
};

const eliminarMarca = async (id) => {
    const urlApi = `${apiEliminarMarca}${id}`;
    let dataRespuesta = { Mensaje: 'Hubo un problema con la promesa', EsCorrecto: false };
    try {
        return axios.delete(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al eliminar marca: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { Mensaje: 'Marca eliminada (mock)', EsCorrecto: true };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en eliminarMarca: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { Mensaje: 'Marca eliminada (mock)', EsCorrecto: true };
        }
        return dataRespuesta;
    }
};

export {
    obtenerListaDeMarcas,
    obtenerMarcaPorId,
    crearMarca,
    actualizarMarca,
    eliminarMarca
};
