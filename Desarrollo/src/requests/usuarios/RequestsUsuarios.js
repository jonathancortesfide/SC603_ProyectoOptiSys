import axios from "axios";
import {
    ejemploListaUsuarios,
    ejemploUsuario,
    responseCrearUsuario,
    responseActualizarUsuario,
    responseEliminarUsuario,
    responseBuscarUsuarios
} from '../../views/seguridad/ejemplosDatos';
import {
    apiObtenerUsuarios,
    apiObtenerUsuarioPorId,
    apiCrearUsuario,
    apiActualizarUsuario,
    apiEliminarUsuario,
    apiCambiarContrasena,
    apiBuscarUsuarios
} from './DireccionesRequest';

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

const obtenerListaDeUsuarios = async () => {
    const urlApi = `${apiObtenerUsuarios}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) {
                    return respuesta.data;
                }
            })
            .catch(e => {
                console.log("Error al obtener lista de usuarios: " + e);
                // Dev fallback: return example data when backend is unreachable
                if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploListaUsuarios;
                return [];
            })
    } catch (error) {
        console.log("Error en obtenerListaDeUsuarios: " + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploListaUsuarios;
        return [];
    }
};

const obtenerUsuarioPorId = async (usuarioId) => {
    const urlApi = `${apiObtenerUsuarioPorId}${usuarioId}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) {
                    return respuesta.data;
                }
            })
            .catch(e => {
                console.log("Error al obtener usuario: " + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploUsuario;
                return null;
            })
    } catch (error) {
        console.log("Error en obtenerUsuarioPorId: " + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploUsuario;
        return null;
    }
};

const buscarUsuarios = async (parametroDeBusqueda) => {
    const urlApi = `${apiBuscarUsuarios}parametro=${parametroDeBusqueda}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) {
                    return respuesta.data;
                }
            })
            .catch(e => {
                console.log("Error al buscar usuarios: " + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') return responseBuscarUsuarios;
                return [];
            })
    } catch (error) {
        console.log("Error en buscarUsuarios: " + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') return responseBuscarUsuarios;
        return [];
    }
};

const crearUsuario = async (usuario) => {
    const urlApi = `${apiCrearUsuario}`;
    let dataRespuesta = {
        Mensaje: "Hubo un problema con la promesa",
        EsCorrecto: false,
        Data: null
    };
    try {
        return axios.post(urlApi, usuario)
            .then(respuesta => {
                if (respuesta.status === 200 || respuesta.status === 201) {
                    dataRespuesta = respuesta.data;
                    return dataRespuesta;
                }
            })
            .catch(e => {
                console.log("Error al crear usuario: " + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') return responseCrearUsuario;
                return dataRespuesta;
            })
    } catch (error) {
        console.log("Error en crearUsuario: " + error);
        return dataRespuesta;
    }
};

const actualizarUsuario = async (usuarioId, usuario) => {
    const urlApi = `${apiActualizarUsuario}${usuarioId}`;
    let dataRespuesta = {
        Mensaje: "Hubo un problema con la promesa",
        EsCorrecto: false,
        Data: null
    };
    try {
        return axios.put(urlApi, usuario)
            .then(respuesta => {
                if (respuesta.status === 200) {
                    dataRespuesta = respuesta.data;
                    return dataRespuesta;
                }
            })
            .catch(e => {
                console.log("Error al actualizar usuario: " + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') return responseActualizarUsuario;
                return dataRespuesta;
            })
    } catch (error) {
        console.log("Error en actualizarUsuario: " + error);
        return dataRespuesta;
    }
};

const cambiarContrasena = async (usuarioId, contrasenaActual, contrasenaNueva) => {
    const urlApi = `${apiCambiarContrasena}${usuarioId}`;
    const payload = {
        contrasenaActual,
        contrasenaNueva
    };
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
                console.log("Error al cambiar contraseña: " + e);
                return dataRespuesta;
            })
    } catch (error) {
        console.log("Error en cambiarContrasena: " + error);
        return dataRespuesta;
    }
};

const eliminarUsuario = async (usuarioId) => {
    const urlApi = `${apiEliminarUsuario}${usuarioId}`;
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
                console.log("Error al eliminar usuario: " + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') return responseEliminarUsuario;
                return dataRespuesta;
            })
    } catch (error) {
        console.log("Error en eliminarUsuario: " + error);
        return dataRespuesta;
    }
};

export {
    obtenerListaDeUsuarios,
    obtenerUsuarioPorId,
    buscarUsuarios,
    crearUsuario,
    actualizarUsuario,
    cambiarContrasena,
    eliminarUsuario
};
