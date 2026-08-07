import axios from 'src/utils/axios';

const apiBase = import.meta.env.VITE_ApiBase;
const apiTipoIdentificacion = `${apiBase}/TipoIdentificacion/ObtenerTipoIdentificacion`;

const normalizarLista = (data) => {
  if (Array.isArray(data)) return data;

  const keys = ['tiposIdentificacion', 'TiposIdentificacion', 'laListaDeTiposIdentificacion', 'datos', 'data'];
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }

  return [];
};

const obtenerTiposIdentificacion = async () => {
  const respuesta = await axios.get(apiTipoIdentificacion);
  return normalizarLista(respuesta.data);
};

const normalizarTipoIdentificacion = (tipo = {}) => ({
  idTipoIdentificacion: tipo.idTipoIdentificacion ?? tipo.id_tipo_identificacion ?? tipo.IdTipoIdentificacion ?? 0,
  codigo: tipo.codigo ?? tipo.Codigo ?? '',
  nombre: tipo.nombre ?? tipo.Nombre ?? '',
  activo: tipo.activo ?? tipo.Activo ?? true,
});

export { obtenerTiposIdentificacion, normalizarTipoIdentificacion };