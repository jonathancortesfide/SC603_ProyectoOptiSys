import axios from "axios";
import { apiAgregarExamenes, apiObtenerExamenCompleto } from './DireccionesRequest';
import { getSucursalIdentificador } from '../../utils/sucursal';

axios.interceptors.request.use(async (config) => {
    config.headers = {
        "Content-Type": "application/json",
        Accept: "application/json"
    };
    return config;
}, function (error) {
    return Promise.reject(error);
});

axios.interceptors.response.use(async (response) => {
    return response;
}, function (error) {
    return Promise.reject(error);
});

/**
 * Convierte datos RX (OD/OI) a formato XML para el backend
 * @param {Object} rxData - Datos de RX con estructura {OD: {...}, OI: {...}, observaciones: ""}
 * @param {string} tipoRx - Tipo de RX: "Base", "Actual", "Cerca", "Contacto"
 * @returns {string} XML string
 */
const convertRxToXml = (rxData, tipoRx) => {
    if (!rxData) {
        return `<${tipoRx}><OD></OD><OI></OI></${tipoRx}>`;
    }

    let xml = `<${tipoRx}>`;

    if (rxData.OD && Object.keys(rxData.OD).length > 0) {
        xml += '<OD>';
        Object.entries(rxData.OD).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                xml += `<${key}>${String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${key}>`;
            }
        });
        xml += '</OD>';
    } else {
        xml += '<OD></OD>';
    }

    if (rxData.OI && Object.keys(rxData.OI).length > 0) {
        xml += '<OI>';
        Object.entries(rxData.OI).forEach(([key, value]) => {
            if (value !== null && value !== undefined && value !== '') {
                xml += `<${key}>${String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${key}>`;
            }
        });
        xml += '</OI>';
    } else {
        xml += '<OI></OI>';
    }

    if (rxData.observaciones) {
        xml += `<Observaciones>${String(rxData.observaciones).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</Observaciones>`;
    }

    xml += `</${tipoRx}>`;
    return xml;
};

/**
 * Convierte datos de examen del frontend al formato AgregarExamenDto esperado por el backend
 * @param {Object} examen - Datos del examen del frontend
 * @returns {Object} DTO formateado para el backend
 */
const sanitizeValue = (value) => {
    if (value === undefined || value === null) return undefined;
    if (typeof value === 'string') {
        const trimmed = value.trim();
        return trimmed === '' ? undefined : trimmed;
    }
    return value;
};

const ordenarDto = (dto) => {
    return Object.fromEntries(
        Object.entries(dto)
            .filter(([, value]) => value !== undefined)
            .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
    );
};

const buildAgregarExamenDto = (examen = {}) => {
    const identificador = getSucursalIdentificador();

    let fechaExamen = new Date().toISOString();
    if (examen.FechaExamen) {
        if (typeof examen.FechaExamen === 'string') {
            fechaExamen = new Date(`${examen.FechaExamen}T00:00:00`).toISOString();
        } else if (examen.FechaExamen instanceof Date) {
            fechaExamen = examen.FechaExamen.toISOString();
        }
    }

    const xmlActual = convertRxToXml(examen.RxBase || { OD: {}, OI: {} }, 'Actual');
    const xmlGraduaciones = `<Graduaciones>${xmlActual}</Graduaciones>`;

    let xmlDisenos = '';
    if (examen.DisenioLente && examen.DisenioLente.length > 0) {
        xmlDisenos = '<Disenos>';
        examen.DisenioLente.forEach((diseno, idx) => {
            xmlDisenos += `<Diseno id="${idx}">`;
            Object.entries(diseno).forEach(([key, value]) => {
                if (value !== null && value !== undefined && value !== '') {
                    xmlDisenos += `<${key}>${String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</${key}>`;
                }
            });
            xmlDisenos += '</Diseno>';
        });
        xmlDisenos += '</Disenos>';
    }

    const dto = ordenarDto({
        NoExamen: sanitizeValue(examen.NoExamen) ?? 0,
        FechaExamen: fechaExamen,
        Paciente: sanitizeValue(examen.Paciente),
        MotivoDeConsulta: sanitizeValue(examen.Motivo) ?? '',
        CodigoProfesional: sanitizeValue(examen.CodigoProfesional),

        ObservacionesGenerales: sanitizeValue(examen.observacionesGenerales),
        XmlGraduaciones: xmlGraduaciones, // aca enviamos todas las graduaciones en un solo campo

        TipoLente: sanitizeValue(examen.TipoLente),
        TipoLenteId: sanitizeValue(examen.TipoLenteId),
        Material: sanitizeValue(examen.Material),
        MaterialId: sanitizeValue(examen.MaterialId),
        Aro: sanitizeValue(examen.Aro) ?? '',
        CodigoAro: sanitizeValue(examen.CodigoAro) ?? '',
        Laboratorio: sanitizeValue(examen.Laboratorio),
        NumeroOrdenLaboratorio: sanitizeValue(examen.NumeroOrdenLaboratorio),
        NumeroPedidoLaboratorio: sanitizeValue(examen.NumeroPedidoLaboratorio),
        Disposicion: sanitizeValue(examen.Disposicion),
        Tratamiento: sanitizeValue(examen.Tratamiento),

        CostoAro: sanitizeValue(examen.CostoAro),
        CostoLente: sanitizeValue(examen.CostoLente),
        CostoMaterial: sanitizeValue(examen.CostoMaterial),
        CostoExamen: sanitizeValue(examen.CostoExamen),
        PrecioFinal: sanitizeValue(examen.PrecioFinal),
       


        Estado: sanitizeValue(examen.Estado) ?? 'Activo',
        Fo: sanitizeValue(examen.Fo),
        IdProfesional: sanitizeValue(examen.IdProfesional) ?? null,
        Identificador: sanitizeValue(examen.Identificador) ?? identificador ?? null,
        Material: sanitizeValue(examen.Material),
        NoPaciente: sanitizeValue(examen.NoPaciente) ?? 0,
        NombrePaciente: sanitizeValue(examen.NombrePaciente),
        NombreProfesional: sanitizeValue(examen.NombreProfesional),
        NumeroEmpresa: sanitizeValue(examen.NumeroEmpresa) ?? identificador ?? 1,
        
        
        
    });

    return dto;
};

const AgregarExamen = async (examen) => {
    const urlApi = `${apiAgregarExamenes}`;
    let dataRespuesta = {
        Mensaje: "Hubo un problema al guardar el examen",
        EsCorrecto: false
    };
    try {
        const dto = buildAgregarExamenDto(examen);
        console.log('DTO enviado al backend para el', dto);

        return axios.post(urlApi, dto)
            .then(respuesta => {
                if (respuesta.status === 200) {
                    dataRespuesta = respuesta.data;
                    return dataRespuesta;
                }
                return dataRespuesta;
            })
            .catch(e => {
                console.log("Error en AgregarExamen:", e);
                if (e.response && e.response.data) {
                    console.log("Detalle del error:", e.response.data);
                    dataRespuesta.Mensaje = e.response.data.mensaje || JSON.stringify(e.response.data);
                }
                return dataRespuesta;
            });
    } catch (error) {
        console.log("Error en buildAgregarExamenDto:", error);
        dataRespuesta.Mensaje = error.message;
        return dataRespuesta;
    }
};

const obtenerExamenCompletoPorNoPaciente = async (noPaciente) => {
    const urlApi = `${apiObtenerExamenCompleto}?noPaciente=${encodeURIComponent(String(noPaciente))}`;
    try {
        return axios.post(urlApi, {})
            .then(respuesta => {
                if (respuesta.status === 200) {
                    return respuesta.data;
                }
                return [];
            })
            .catch(e => {
                console.log("Error en ObtenerExamenCompletoPorNoPaciente:", e);
                return [];
            });
    } catch (error) {
        console.log("Error en obtenerExamenCompletoPorNoPaciente:", error);
        return [];
    }
};

export {
    AgregarExamen,
    obtenerExamenCompletoPorNoPaciente,
    buildAgregarExamenDto
};