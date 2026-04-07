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
const _normalizarRespuesta = (data, fallbackMensaje = 'Hubo un problema con la promesa') => ({
    ...data,
    EsCorrecto: data?.EsCorrecto ?? data?.esCorrecto ?? false,
    Mensaje: data?.Mensaje ?? data?.mensaje ?? fallbackMensaje,
    Data: data?.Data ?? data?.data ?? null,
});
const _normalizarError = (error, fallbackMensaje = 'Error de conexión con el API') => {
    const data = error?.response?.data;
    const respuesta = _normalizarRespuesta(data, error?.message ?? fallbackMensaje);

    if (data?.errors) {
        const detalles = Object.values(data.errors)
            .flat()
            .filter(Boolean)
            .join(' | ');

        if (detalles) {
            return {
                ...respuesta,
                Mensaje: detalles,
                EsCorrecto: false,
            };
        }
    }

    return {
        ...respuesta,
        EsCorrecto: false,
        Mensaje: respuesta.Mensaje || error?.message || fallbackMensaje,
    };
};

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
    try {
        const respuesta = await axios.post(urlApi, paciente);
        if (_isSuccessStatus(respuesta.status)) {
            const dataRespuesta = _normalizarRespuesta(respuesta.data);
            _cachePacientes = { data: null, ts: 0 };
            return dataRespuesta;
        }

        return {
            Mensaje: `Respuesta inesperada del API (${respuesta.status})`,
            EsCorrecto: false,
        };
    } catch (error) {
        console.log('Se produjo un error en el método AgregarPaciente.', error);
        return _normalizarError(error, 'No se pudo crear el paciente');
    }
}

const ActualizarPaciente = async (numeroDePaciente, paciente) => {
    const urlApi = `${apiActualizarPacientes}${numeroDePaciente}`;
    try {
        const respuesta = await axios.put(urlApi, paciente);
        if (_isSuccessStatus(respuesta.status)) {
            const dataRespuesta = _normalizarRespuesta(respuesta.data);
            _cachePacientes = { data: null, ts: 0 };
            return dataRespuesta;
        }

        return {
            Mensaje: `Respuesta inesperada del API (${respuesta.status})`,
            EsCorrecto: false,
        };
    } catch (error) {
        console.log('Se produjo un error en el método ActualizarPaciente.', error);
        return _normalizarError(error, 'No se pudo actualizar el paciente');
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