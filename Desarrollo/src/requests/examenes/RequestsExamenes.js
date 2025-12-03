import axios from "axios";
import {apiAgregarExamenes} from './DireccionesRequest';

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

const AgregarExamen = async (examen) => {
    const urlApi = `${apiAgregarExamenes}`;
    let dataRespuesta = {
        Mensaje: "Hubo un problema con la promesa",
        EsCorrecto : false
    };
    try {
        return axios.post(urlApi, examen)
            .then(respuesta => {
                if (respuesta.status === 200) {
                    dataRespuesta = respuesta.data;
                    return dataRespuesta;
                }
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

export {
    AgregarExamen
};