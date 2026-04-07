const apiBase = import.meta.env.VITE_ApiBase;

const apiTipoLentes = `${apiBase}/TipoLente/`;
const apiTipoLentePorId = `${apiBase}/TipoLente/`;
const apiObtenerTipoLente = `${apiBase}/TipoLente/Obtener?no_empresa=`;
const apiCrearTipoLente = `${apiBase}/TipoLente/Agregar`;
const apiActualizarTipoLente = `${apiBase}/TipoLente/`;
const apiEliminarTipoLente = `${apiBase}/TipoLente/`;
const apiCambiarEstadoTipoLente = `${apiBase}/TipoLente/cambiar-estado/`;
const apiModificarEstadoTipoLente = `${apiBase}/TipoLente/ModificarEstado/`;

export {
  apiTipoLentes,
  apiTipoLentePorId,
  apiObtenerTipoLente,
  apiCrearTipoLente,
  apiActualizarTipoLente,
  apiEliminarTipoLente,
  apiCambiarEstadoTipoLente,
  apiModificarEstadoTipoLente
};
