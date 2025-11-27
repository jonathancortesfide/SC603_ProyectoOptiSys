import axios from "axios";
import {
    apiObtenerRoles,
    apiObtenerRolPorId,
    apiCrearRol,
    apiActualizarRol,
    apiEliminarRol,
    apiObtenerPermisos,
    apiAsignarRolAUsuario,
    apiDesvincularRolDelUsuario,
    apiObtenerRolesDelUsuario
} from './DireccionesRequest';
import { ejemploListaRoles, ejemploListaPermisos, responseCrearRol, responseActualizarRol, responseEliminarRol, responseAsignarRol, responseDesvincularRol, ejemploRolesDelUsuario } from '../../views/seguridad/ejemplosDatos';

axios.interceptors.request.use(async (config) => {
    config.headers = {
        "Content-Type": "application/json",
        Accept: "application/json"
    };
    return config
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(async (response) => {
    return response;
}, function (error) {
    return Promise.reject(error);
});

const obtenerListaDeRoles = async () => {
    const urlApi = `${apiObtenerRoles}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) {
                    return respuesta.data;
                }
            })
            .catch(e => {
                console.log("Error al obtener lista de roles: " + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploListaRoles;
                return [];
            })
    } catch (error) {
        console.log("Error en obtenerListaDeRoles: " + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploListaRoles;
        return [];
    }
};

const obtenerRolPorId = async (rolId) => {
    const urlApi = `${apiObtenerRolPorId}${rolId}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) {
                    return respuesta.data;
                }
            })
            .catch(e => {
                console.log("Error al obtener rol: " + e);
                return null;
            })
    } catch (error) {
        console.log("Error en obtenerRolPorId: " + error);
        return null;
    }
};

const crearRol = async (rol) => {
    const urlApi = `${apiCrearRol}`;
    let dataRespuesta = {
        Mensaje: "Hubo un problema con la promesa",
        EsCorrecto: false,
        Data: null
    };
    try {
        return axios.post(urlApi, rol)
            .then(respuesta => {
                if (respuesta.status === 200 || respuesta.status === 201) {
                    dataRespuesta = respuesta.data;
                    return dataRespuesta;
                }
            })
            .catch(e => {
                console.log("Error al crear rol: " + e);
                return dataRespuesta;
            })
    } catch (error) {
        console.log("Error en crearRol: " + error);
        return dataRespuesta;
    }
};

const actualizarRol = async (rolId, rol) => {
    const urlApi = `${apiActualizarRol}${rolId}`;
    let dataRespuesta = {
        Mensaje: "Hubo un problema con la promesa",
        EsCorrecto: false,
        Data: null
    };
    try {
        return axios.put(urlApi, rol)
            .then(respuesta => {
                if (respuesta.status === 200) {
                    dataRespuesta = respuesta.data;
                    return dataRespuesta;
                }
            })
            .catch(e => {
                console.log("Error al actualizar rol: " + e);
                return dataRespuesta;
            })
    } catch (error) {
        console.log("Error en actualizarRol: " + error);
        return dataRespuesta;
    }
};

const eliminarRol = async (rolId) => {
    const urlApi = `${apiEliminarRol}${rolId}`;
    let dataRespuesta = {
        Mensaje: "Hubo un problema con la promesa",
        EsCorrecto: false
    };
    try {
        return axios.delete(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) {
                    dataRespuesta = respuesta.data;
                    return dataRespuesta;
                }
            })
            .catch(e => {
                console.log("Error al eliminar rol: " + e);
                return dataRespuesta;
            })
    } catch (error) {
        console.log("Error en eliminarRol: " + error);
        return dataRespuesta;
    }
};

const obtenerPermisos = async () => {
    const urlApi = `${apiObtenerPermisos}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) {
                    return respuesta.data;
                }
            })
            .catch(e => {
                console.log("Error al obtener permisos: " + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploListaPermisos;
                return [];
            })
    } catch (error) {
        console.log("Error en obtenerPermisos: " + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploListaPermisos;
        return [];
    }
};

const asignarRolAUsuario = async (usuarioId, rolId) => {
    const urlApi = `${apiAsignarRolAUsuario}`;
    const payload = { usuarioId, rolId };
    let dataRespuesta = {
        Mensaje: "Hubo un problema con la promesa",
        EsCorrecto: false
    };
    try {
        return axios.post(urlApi, payload)
            .then(respuesta => {
                if (respuesta.status === 200 || respuesta.status === 201) {
                    dataRespuesta = respuesta.data;
                    return dataRespuesta;
                }
            })
            .catch(e => {
                console.log("Error al asignar rol: " + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') return responseAsignarRol;
                return dataRespuesta;
            })
    } catch (error) {
        console.log("Error en asignarRolAUsuario: " + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') return responseAsignarRol;
        return dataRespuesta;
    }
};

const desvincularRolDelUsuario = async (usuarioId, rolId) => {
    const urlApi = `${apiDesvincularRolDelUsuario}`;
    const payload = { usuarioId, rolId };
    let dataRespuesta = {
        Mensaje: "Hubo un problema con la promesa",
        EsCorrecto: false
    };
    try {
        return axios.post(urlApi, payload)
            .then(respuesta => {
                if (respuesta.status === 200) {
                    dataRespuesta = respuesta.data;
                    return dataRespuesta;
                }
            })
            .catch(e => {
                console.log("Error al desvincular rol: " + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') return responseDesvincularRol;
                return dataRespuesta;
            })
    } catch (error) {
        console.log("Error en desvincularRolDelUsuario: " + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') return responseDesvincularRol;
        return dataRespuesta;
    }
};

const obtenerRolesDelUsuario = async (usuarioId) => {
    const urlApi = `${apiObtenerRolesDelUsuario}${usuarioId}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) {
                    return respuesta.data;
                }
            })
            .catch(e => {
                console.log("Error al obtener roles del usuario: " + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploRolesDelUsuario;
                return [];
            })
    } catch (error) {
        console.log("Error en obtenerRolesDelUsuario: " + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploRolesDelUsuario;
        return [];
    }
};

export {
    obtenerListaDeRoles,
    obtenerRolPorId,
    crearRol,
    actualizarRol,
    eliminarRol,
    obtenerPermisos,
    asignarRolAUsuario,
    desvincularRolDelUsuario,
    obtenerRolesDelUsuario
};
