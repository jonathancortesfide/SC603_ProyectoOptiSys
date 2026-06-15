import axios from "axios";
import { getSucursalIdentificador } from '../../utils/sucursal';

const apiHost = import.meta.env.VITE_API_HOST || 'https://localhost:44352';
const apiObtenerDoctores = `${apiHost.replace(/\/$/, '')}/api/Usuario/ObtenerDoctores/`;

const BuscarDoctoresPorIdentificador = async (identificador) => {
    const id = identificador ?? getSucursalIdentificador();
    const url = `${apiObtenerDoctores}${id}`;
    try {
        return axios.post(url, { identificador: id })
            .then(respuesta => {
                if (respuesta.status === 200) {
                    const data = respuesta.data;
                    if (data && Array.isArray(data.datos)) {
                        return data.datos;
                    }
                    return [];
                }
                return [];
            })
            .catch(e => {
                console.log("Error al realizar la petición ObtenerDoctores: " + e);
                return [];
            });
    } catch (error) {
        console.log("Se produjo un error en BuscarDoctoresPorIdentificador: " + error);
        return [];
    }
};

export {
    BuscarDoctoresPorIdentificador
};
