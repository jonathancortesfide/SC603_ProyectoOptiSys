const apiBase = import.meta.env.VITE_ApiBase;

//Constantes globales de uso de la aplicacion
export const apiAgregarExamenes  = `${apiBase}/Examenes/AgregarExamen`;
export const apiObtenerExamenCompleto = `${apiBase}/ExamenCompleto/ObtenerPorNoPaciente`;

/** Base del controlador de graduaciones (GET .../Obtener?identificador=). */
export const apiGraduacion = `${apiBase}/Graduacion`;
