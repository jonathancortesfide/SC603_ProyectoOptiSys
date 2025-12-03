import axios from "axios";
import {apiObtenerPacientes, apiBuscarPacientes, apiAgregarPacientes} from './DireccionesRequest';

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

const obtenerListaDePacientes = async () => {
    const urlApi = `${apiObtenerPacientes}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) {
                    return respuesta.data;
                }
            })
            .catch(e => {
                console.log("Error producido al realizar la petición por medio de Axios al API para el método ConsultarParametrosSolicitudCancelacionOmision. Error: " + e);
                return [];
            })
    } catch (error) {
        console.log("Se produjo un error en el método ConsultarParametrosSolicitudCancelacionOmision. Error: " + error);
        return [];
    }
}

const BuscarPacientePorNombreOIdentificacion = async (parametroDeBusqueda) => {
    const urlApi = `${apiBuscarPacientes}parametroDeBusqueda=${parametroDeBusqueda}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (respuesta.status === 200) {
                    return respuesta.data;
                }
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
                if (respuesta.status === 200) {
                    dataRespuesta = respuesta.data;
                    return dataRespuesta;
                }
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

export {
    obtenerListaDePacientes, BuscarPacientePorNombreOIdentificacion, AgregarPaciente
};