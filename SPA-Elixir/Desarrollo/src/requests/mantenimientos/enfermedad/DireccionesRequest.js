const apiBase = import.meta.env.VITE_ApiBase;

const apiEnfermedades = `${apiBase}/enfermedades`;
const apiTiposEnfermedades = `${apiBase}/enfermedades/tipos`;
const apiCatalogoEnfermedades = `${apiBase}/enfermedades/catalogo`;
const apiAgregarEnfermedadConCatalogo = `${apiBase}/enfermedades/agregarconCatalogo`;
const apiObtenerEnfermedadPorIdentificador = `${apiBase}/enfermedades/ObtenerEnfermedadPorIdentificador`;
const apiCambiarEstadoEnfermedad = `${apiBase}/enfermedades/`;

export {
    apiEnfermedades,
    apiTiposEnfermedades,
    apiCatalogoEnfermedades,
    apiAgregarEnfermedadConCatalogo,
    apiObtenerEnfermedadPorIdentificador,
    apiCambiarEstadoEnfermedad,
};