const apiBase = import.meta.env.VITE_ApiBase;

export const apiObtenerPacientes         = `${apiBase}/Paciente/ObtenerPaciente`;
export const apiObtenerPacientePorId     = `${apiBase}/Paciente/ObtenerPacientePorId`;
export const apiAgregarPacientes         = `${apiBase}/Paciente/AgregarPaciente`;
export const apiModificarPacientes       = `${apiBase}/Paciente/ModificarPaciente`;
export const apiModificarEstadoPaciente  = `${apiBase}/Paciente/ModificarEstadoPaciente`;
