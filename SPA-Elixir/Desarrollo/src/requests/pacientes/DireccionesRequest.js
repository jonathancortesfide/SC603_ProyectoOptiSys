const apiBase = import.meta.env.VITE_ApiBase;

//Constantes globales de uso de la aplicacion

export const apiObtenerPacientes  = `${apiBase}/Pacientes?`;
export const apiBuscarPacientes  = `${apiBase}/Pacientes/BuscarPacientePorNombreOIdentificacion?`;
export const apiAgregarPacientes  = `${apiBase}/Pacientes/AgregarPaciente`;
export const apiObtenerCuentasPaciente = `${apiBase}/Pacientes/Cuentas?pacienteId=`;
