const apiBase = import.meta.env.VITE_ApiBase;

const apiClasificacionesPacientesPorEmpresa = `${apiBase}/PacienteClasificacion/ObtenerPorEmpresa/`;
const apiCrearClasificacionPaciente = `${apiBase}/PacienteClasificacion/AgregarClasificacion`;
const apiActualizarClasificacionPaciente = `${apiBase}/PacienteClasificacion/ModificarClasificacion`;
const apiCambiarEstadoClasificacionPaciente = `${apiBase}/PacienteClasificacion/`;

export {
    apiClasificacionesPacientesPorEmpresa,
    apiCrearClasificacionPaciente,
    apiActualizarClasificacionPaciente,
    apiCambiarEstadoClasificacionPaciente
};
