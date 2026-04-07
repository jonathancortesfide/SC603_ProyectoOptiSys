import axios from "axios";
import {apiAgregarExamenes, apiObtenerExamenes} from './DireccionesRequest';

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

const _isSuccessStatus = (status) => status === 200 || status === 201;

const AgregarExamen = async (examen) => {
    const urlApi = `${apiAgregarExamenes}`;
    let dataRespuesta = {
        Mensaje: "Hubo un problema con la promesa",
        EsCorrecto : false
    };
    try {
        return axios.post(urlApi, examen)
            .then(respuesta => {
                if (_isSuccessStatus(respuesta.status)) {
                    dataRespuesta = respuesta.data;
                    return dataRespuesta;
                }
                return dataRespuesta;
            })
            .catch(e => {
                console.log("Error producido al realizar la petición por medio de Axios al API para el método AgregarExamen. Error: " + e);
                return dataRespuesta;
            })
    } catch (error) {
        console.log("Se produjo un error en el método AgregarExamen. Error: " + error);
        return dataRespuesta;
    }
}

const obtenerExamenes = async (noPaciente = '') => {
    const query = noPaciente ? `?NoPaciente=${encodeURIComponent(noPaciente)}` : '';
    const urlApi = `${apiObtenerExamenes}${query}`;
    try {
        return axios.get(urlApi)
            .then(respuesta => {
                if (_isSuccessStatus(respuesta.status)) {
                    return respuesta.data;
                }
                return [];
            })
            .catch(e => {
                console.log("Error producido al realizar la petición por medio de Axios al API para el método obtenerExamenes. Error: " + e);
                return [];
            })
    } catch (error) {
        console.log("Se produjo un error en el método obtenerExamenes. Error: " + error);
        return [];
    }
}

export {
    AgregarExamen,
    obtenerExamenes
};