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
const buildAgregarExamenDto = (examen) => {
    const identificador = getSucursalIdentificador();

    // Convertir fecha string a ISO string
    let fechaExamen = new Date().toISOString();
    if (examen.FechaExamen) {
        if (typeof examen.FechaExamen === 'string') {
            fechaExamen = new Date(`${examen.FechaExamen}T00:00:00`).toISOString();
        } else if (examen.FechaExamen instanceof Date) {
            fechaExamen = examen.FechaExamen.toISOString();
        }
    }

    // Convertir datos RX a XML - SIEMPRE crear XML válido
    const xmlBase = convertRxToXml(examen.RxBase || { OD: {}, OI: {} }, 'Base');
    const xmlActual = convertRxToXml(examen.RxActual || { OD: {}, OI: {} }, 'Actual');
    const xmlCerca = convertRxToXml(examen.RxCerca || { OD: {}, OI: {} }, 'Cerca');
    const xmlContacto = convertRxToXml(examen.RxContacto || { OD: {}, OI: {} }, 'Contacto');
    
    // Construir XML de graduaciones con estructura válida
    const xmlGraduaciones = `<Graduaciones>${xmlBase}${xmlActual}${xmlCerca}${xmlContacto}</Graduaciones>`;

    // Crear XML de diseños si existen
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

    const dto = {
        // Campos requeridos por el DTO - NUNCA null
        NoExamen: examen.NoExamen || 0,
        NoPaciente: examen.NoPaciente || 0,
        FechaExamen: fechaExamen,
        Motivo: examen.Motivo || '',

        // Campos de datos clínicos (con valores por defecto si no están presentes)
        TipoExamen: examen.TipoExamen || 'Refracción',
        DpGeneral: examen.DpGeneral || '',
        MedioTransp: examen.MedioTransp || 'Claro',
        Fo: examen.Fo || '',
        Pio: examen.Pio || '',
        NumeroEmpresa: identificador || 1,
        Estado: examen.Estado || 'Activo',
        UltimoExamen: examen.UltimoExamen ? new Date(examen.UltimoExamen).toISOString() : new Date().toISOString(),
        TratamientoAnterior: examen.TratamientoAnterior || '',
        ModoUso: examen.ModoUso || '',
        TipoPatologias: examen.TipoPatologias || '',

        // Campos de diseño
        TieneDiseno: (examen.TieneDiseno === true || examen.TieneDiseno === 'S') ? 'S' : 'N',
        TieneAro: (examen.TieneAro === true || examen.TieneAro === 'S') ? 'S' : 'N',
        TipoDml: 'I', // I = Insert (siempre crear nuevo)

        // Medidas de lente
        Diagonal: parseFloat(examen.Diagonal) || 0,
        Vertical: parseFloat(examen.Vertical) || 0,
        Puente: parseFloat(examen.Puente) || 0,
        Horizontal: parseFloat(examen.Horizontal) || 0,

        // XML de datos complejos - SIEMPRE válido
        XmlPatologias: examen.XmlPatologias || '',
        XmlGraduaciones: xmlGraduaciones,
        XmlDisenos: xmlDisenos,

        // Información de laboratorio
        CodigoAro: examen.CodigoAro || '',
        NumeroProveedorLaboratorio: examen.NumeroProveedorLaboratorio || 0,
        NumeroOrdenLaboratorio: examen.NumeroOrdenLaboratorio || '',
        NumeroPedidoLaboratorio: examen.NumeroPedidoLaboratorio || '',

        // Información de lente de contacto
        codigoLenteContacto: examen.codigoLenteContacto || '',

        // Imagen (opcional)
        Imagen: examen.Imagen || null,
        CodigoExamen: examen.CodigoExamen || ''
    };

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
        console.log('DTO enviado al backend:', dto);

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