const apiBase = import.meta.env.VITE_ApiBase;

const apiTipoLentes = `${apiBase}/TipoLente/`;
const apiTipoLentePorId = `${apiBase}/TipoLente/`;
const apiObtenerTipoLente = `${apiBase}/TipoLente/Obtener?no_empresa=`;
const apiObtenerTipoLentePorDescripcion = `${apiBase}/TipoLente/Obtener?descripcion=`;
const apiCrearTipoLente = `${apiBase}/TipoLente/Agregar`; 
const apiActualizarTipoLente = `${apiBase}/TipoLente/Modificar`;
const apiEliminarTipoLente = `${apiBase}/TipoLente/`;
const apiCambiarEstadoTipoLente = `${apiBase}/TipoLente/cambiar-estado/`;
const apiModificarEstadoTipoLente = `${apiBase}/TipoLente/ModificarEstado/`;

export {
  apiTipoLentes,
  apiTipoLentePorId,
  apiObtenerTipoLente,
  apiObtenerTipoLentePorDescripcion,
  apiCrearTipoLente,
  apiActualizarTipoLente,
  apiEliminarTipoLente,
  apiCambiarEstadoTipoLente,
  apiModificarEstadoTipoLente
};
