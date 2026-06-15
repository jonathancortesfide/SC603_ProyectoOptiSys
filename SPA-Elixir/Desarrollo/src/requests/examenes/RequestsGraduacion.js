import axios from 'axios';
import { apiGraduacion } from './DireccionesRequest';

const http = axios.create();

http.interceptors.request.use(
  (config) => {
    config.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Graduaciones asociadas al identificador (misma idea que listas de precio / monedas por sucursal).
 * Respuesta .NET típica: { listaGraduaciones, mensaje, esCorrecto } (camelCase) o PascalCase.
 */
export async function obtenerGraduacionesPorIdentificador(identificador) {
  const urlGet = `${apiGraduacion}/Obtener?identificador=${encodeURIComponent(String(identificador))}`;
  try {
    const res = await http.get(urlGet);
    return res.data;
  } catch (error) {
    if (error?.response?.status === 500) {
      const urlPost = `${apiGraduacion}/Obtener`;
      const res = await http.post(urlPost, { identificador });
      return res.data;
    }
    throw error;
  }
}
