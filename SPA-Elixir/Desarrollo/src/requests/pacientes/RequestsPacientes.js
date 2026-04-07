import axios from "axios";
import {apiObtenerPacientes, apiBuscarPacientes, apiAgregarPacientes, apiActualizarPacientes} from './DireccionesRequest';
import { apiObtenerCuentasPaciente } from './DireccionesRequest';
import { ejemploCuentasPaciente, ejemploListaPacientes } from '../../views/seguridad/ejemplosDatos';

axios.interceptors.request.use(async (config) => {

    config.headers = {
        "Content-Type": "application/json",
        Accept: "application/json"
      };
    return config
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(async (response)=> {
    return response;
}, function (error) {
    return Promise.reject(error);
});

let _cachePacientes = { data: null, ts: 0 };
const _CACHE_TTL = 30 * 1000;
const _isSuccessStatus = (status) => status === 200 || status === 201;

const obtenerListaDePacientes = async () => {
    const urlApi = `${apiObtenerPacientes}`;
    const now = Date.now();
    if (_cachePacientes.data && (now - _cachePacientes.ts) < _CACHE_TTL) return _cachePacientes.data;
    if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploListaPacientes;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (_isSuccessStatus(respuesta.status)) {
                    _cachePacientes = { data: respuesta.data, ts: Date.now() };
                    return respuesta.data;
                }
                return [];
            })
            .catch(e => {
                console.log("Error producido al realizar la petición por medio de Axios al API para el método ConsultarParametrosSolicitudCancelacionOmision. Error: " + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploListaPacientes;
                return [];
            })
    } catch (error) {
        console.log("Se produjo un error en el método ConsultarParametrosSolicitudCancelacionOmision. Error: " + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploListaPacientes;
        return [];
    }
}

const BuscarPacientePorNombreOIdentificacion = async (parametroDeBusqueda) => {
    const urlApi = `${apiBuscarPacientes}parametroDeBusqueda=${parametroDeBusqueda}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (_isSuccessStatus(respuesta.status)) {
                    return respuesta.data;
                }
                return [];
            })
            .catch(e => {
                console.log("Error producido al realizar la petición por medio de Axios al API para el método BuscarPacientePorNombreOIdentificacion. Error: " + e);
                return [];
            })
    } catch (error) {
        console.log("Se produjo un error en el método BuscarPacientePorNombreOIdentificacion. Error: " + error);
        return [];
    }
}

const AgregarPaciente = async (paciente) => {
    const urlApi = `${apiAgregarPacientes}`;
    let dataRespuesta = {
        Mensaje: "Hubo un problema con la promesa",
        EsCorrecto : false
    };
    try {
        return axios.post(urlApi, paciente)
            .then(respuesta => {
                if (_isSuccessStatus(respuesta.status)) {
                    dataRespuesta = respuesta.data;
                    _cachePacientes = { data: null, ts: 0 };
                    return dataRespuesta;
                }
                return dataRespuesta;
            })
            .catch(e => {
                console.log("Error producido al realizar la petición por medio de Axios al API para el método AgregarPaciente. Error: " + e);
                return dataRespuesta;
            })
    } catch (error) {
        console.log("Se produjo un error en el método AgregarPaciente. Error: " + error);
        return dataRespuesta;
    }
}

const ActualizarPaciente = async (numeroDePaciente, paciente) => {
    const urlApi = `${apiActualizarPacientes}${numeroDePaciente}`;
    let dataRespuesta = {
        Mensaje: "Hubo un problema con la promesa",
        EsCorrecto : false
    };
    try {
        return axios.put(urlApi, paciente)
            .then(respuesta => {
                if (_isSuccessStatus(respuesta.status)) {
                    dataRespuesta = respuesta.data;
                    _cachePacientes = { data: null, ts: 0 };
                    return dataRespuesta;
                }
                return dataRespuesta;
            })
            .catch(e => {
                console.log("Error producido al realizar la petición por medio de Axios al API para el método ActualizarPaciente. Error: " + e);
                return dataRespuesta;
            })
    } catch (error) {
        console.log("Se produjo un error en el método ActualizarPaciente. Error: " + error);
        return dataRespuesta;
    }
}

export {
    obtenerListaDePacientes, BuscarPacientePorNombreOIdentificacion, AgregarPaciente, ActualizarPaciente
};

const obtenerCuentasDePaciente = async (pacienteId) => {
    const urlApi = `${apiObtenerCuentasPaciente}${pacienteId}`;
    if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploCuentasPaciente;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (_isSuccessStatus(respuesta.status)) {
                    return respuesta.data;
                }
                return [];
            })
            .catch(e => {
                console.log("Error al obtener cuentas de paciente: " + e);
                if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploCuentasPaciente;
                return [];
            })
    } catch (error) {
        console.log("Error en obtenerCuentasDePaciente: " + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploCuentasPaciente;
        return [];
    }
};

export { obtenerCuentasDePaciente };