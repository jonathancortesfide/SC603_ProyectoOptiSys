import axios from 'axios';
import {
    apiGruposProductosPorEmpresa,
    apiCrearGrupoProducto,
    apiActualizarGrupoProducto,
    apiCambiarEstadoGrupoProducto,
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

const obtenerListaDeGruposProductos = async (noEmpresa) => {
    const urlApi = `${apiGruposProductosPorEmpresa}${noEmpresa}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al obtener lista de grupos de productos: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return {
                        esCorrecto: true,
                        mensaje: '',
                        laListaDeGrupos: [
                            { no_grupo: 1, descripcion: 'Lentes', no_empresa: Number(noEmpresa), activo: true },
                            { no_grupo: 2, descripcion: 'Accesorios', no_empresa: Number(noEmpresa), activo: true },
                            { no_grupo: 3, descripcion: 'Armazones', no_empresa: Number(noEmpresa), activo: false }
                        ]
                    };
                }
                return respuestaError('No se pudo obtener la lista de grupos de productos');
            });
    } catch (error) {
        console.log('Error en obtenerListaDeGruposProductos: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return {
                esCorrecto: true,
                mensaje: '',
                laListaDeGrupos: [
                    { no_grupo: 1, descripcion: 'Lentes', no_empresa: Number(noEmpresa), activo: true },
                    { no_grupo: 2, descripcion: 'Accesorios', no_empresa: Number(noEmpresa), activo: true },
                    { no_grupo: 3, descripcion: 'Armazones', no_empresa: Number(noEmpresa), activo: false }
                ]
            };
        }
        return respuestaError('No se pudo obtener la lista de grupos de productos');
    }
};

const crearGrupoProducto = async (grupo) => {
    const urlApi = `${apiCrearGrupoProducto}`;
    let dataRespuesta = respuestaError('Hubo un problema al crear el grupo');
    try {
        return axios.post(urlApi, grupo)
            .then(respuesta => {
                if (respuesta.status === 200 || respuesta.status === 201) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al crear grupo de productos: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { esCorrecto: true, mensaje: 'Grupo creado (mock)' };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en crearGrupoProducto: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { esCorrecto: true, mensaje: 'Grupo creado (mock)' };
        }
        return dataRespuesta;
    }
};

const actualizarGrupoProducto = async (grupo) => {
    const urlApi = `${apiActualizarGrupoProducto}`;
    let dataRespuesta = respuestaError('Hubo un problema al actualizar el grupo');
    try {
        return axios.post(urlApi, grupo)
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al actualizar grupo de productos: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { esCorrecto: true, mensaje: 'Grupo actualizado (mock)' };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en actualizarGrupoProducto: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { esCorrecto: true, mensaje: 'Grupo actualizado (mock)' };
        }
        return dataRespuesta;
    }
};

const cambiarEstadoGrupoProducto = async (id, activo, usuario) => {
    const urlApi = `${apiCambiarEstadoGrupoProducto}${id}/estado`;
    let dataRespuesta = respuestaError('Hubo un problema al cambiar el estado del grupo');
    try {
        return axios.post(urlApi, { activo, usuario })
            .then(respuesta => {
                if (respuesta.status === 200) return respuesta.data;
            })
            .catch(e => {
                console.log('Error al cambiar estado de grupo de productos: ' + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') {
                    return { esCorrecto: true, mensaje: 'Estado actualizado (mock)' };
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log('Error en cambiarEstadoGrupoProducto: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') {
            return { esCorrecto: true, mensaje: 'Estado actualizado (mock)' };
        }
        return dataRespuesta;
    }
};

export {
    obtenerListaDeGruposProductos,
    crearGrupoProducto,
    actualizarGrupoProducto,
    cambiarEstadoGrupoProducto
};
