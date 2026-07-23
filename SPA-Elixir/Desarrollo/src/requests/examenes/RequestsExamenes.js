import axios from "axios";
import { apiAgregarExamenes, apiObtenerExamenCompleto, apiExamenSnapshot } from './DireccionesRequest';
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

const buildExamenSnapshotDto = (examen = {}, dto = {}) => {
    const fechaExamen = dto.FechaExamen || new Date().toISOString();
    const xmlGraduaciones = dto.XmlGraduaciones || dto.xml_graduaciones || '';

    return {
        id_examen: sanitizeValue(examen.IdExamen) ?? 0,
        no_examen: sanitizeValue(examen.NoExamen) ?? dto.NoExamen ?? 0,
        no_paciente: sanitizeValue(examen.NoPaciente) ?? dto.NoPaciente ?? 0,
        fecha_examen: fechaExamen,
        nombre_paciente: sanitizeValue(examen.NombrePaciente) ?? '',
        id_profesional: sanitizeValue(examen.IdProfesional) ?? 0,
        nombre_profesional: sanitizeValue(examen.NombreProfesional) ?? '',
        codigo_profesional: sanitizeValue(examen.CodigoProfesional) ?? '',
        motivo_consulta: sanitizeValue(examen.Motivo) ?? '',
        observaciones_generales: sanitizeValue(examen.observacionesGenerales) ?? '',
        tipo_lente_id: sanitizeValue(examen.TipoLenteId) ?? 0,
        tipo_lente: sanitizeValue(examen.TipoLente) ?? '',
        material_id: sanitizeValue(examen.MaterialId) ?? 0,
        material: sanitizeValue(examen.Material) ?? '',
        codigo_aro: sanitizeValue(examen.CodigoAro) ?? 0,
        aro: sanitizeValue(examen.Aro) ?? '',
        laboratorio: sanitizeValue(examen.Laboratorio) ?? '',
        numero_orden_laboratorio: sanitizeValue(examen.NumeroOrdenLaboratorio) ?? '',
        disposicion: sanitizeValue(examen.Disposicion) ?? '',
        tratamiento: sanitizeValue(examen.Tratamiento) ?? '',
        costo_examen: sanitizeValue(examen.CostoExamen) ?? 0,
        costo_material: sanitizeValue(examen.CostoMaterial) ?? 0,
        costo_lente: sanitizeValue(examen.CostoLente) ?? 0,
        costo_aro: sanitizeValue(examen.CostoAro) ?? 0,
        precio_final: sanitizeValue(examen.PrecioFinal) ?? 0,
        estado: sanitizeValue(examen.Estado) ?? 'Activo',
        xml_graduaciones: xmlGraduaciones,
        fecha_creacion: new Date().toISOString(),
    };
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