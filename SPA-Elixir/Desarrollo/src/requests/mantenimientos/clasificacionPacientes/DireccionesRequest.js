const apiBase = import.meta.env.VITE_ApiBase;

const apiClasificacionesPacientes = `${apiBase}/clasificacionpacientes/`;
const apiClasificacionPacientePorId = `${apiBase}/clasificacionpacientes/`;
const apiCrearClasificacionPaciente = `${apiBase}/clasificacionpacientes/`;
const apiActualizarClasificacionPaciente = `${apiBase}/clasificacionpacientes/`;
const apiEliminarClasificacionPaciente = `${apiBase}/clasificacionpacientes/`;

export {
    apiClasificacionesPacientes,
    apiClasificacionPacientePorId,
    apiCrearClasificacionPaciente,
    apiActualizarClasificacionPaciente,
    apiEliminarClasificacionPaciente
};
