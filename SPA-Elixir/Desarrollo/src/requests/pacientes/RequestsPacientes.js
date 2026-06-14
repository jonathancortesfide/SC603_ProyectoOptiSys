import axios from "axios";
import {
    apiObtenerPacientes,
    apiAgregarPacientes,
    apiModificarPacientes,
    apiModificarEstadoPaciente,
} from './DireccionesRequest';
import { getSucursalIdentificador } from '../../utils/sucursal';
import { getCurrentUsername } from '../../utils/session';

let _cachePacientes = { data: null, ts: 0 };
const _CACHE_TTL = 30 * 1000;

const invalidarCache = () => { _cachePacientes = { data: null, ts: 0 }; };

const TIPO_ID_MAP = {
    fisica:    '01',
    juridica:  '02',
    dimex:     '02',
    nite:      '04',
    pasaporte: '03',
};

const buildDto = (form, noPaciente = 0) => ({
    noPaciente,
    identificador:              getSucursalIdentificador(),
    cedula:                     form.identificacion || '',
    nombre:                     form.nombre || '',
    usuario:                    getCurrentUsername(),
    tipoIdentificacion:         TIPO_ID_MAP[form.tipoIdentificacion] ?? form.tipoIdentificacion ?? null,
    direccion:                  form.direccion || null,
    fechaNacimiento:            form.fechaNacimiento ? `${form.fechaNacimiento}T00:00:00` : null,
    email:                      form.email1 || null,
    telefono1:                  form.telefono1 || null,
    sexo:                       form.sexo || null,
    nombreContactoEmergencia:   form.contactoEmergenciaNombre || null,
    telefonoContactoEmergencia: form.contactoEmergenciaTelefono || null,
    activo:                     true,
    sinIdentificacion:          false,
    email2:                     null,
    telefono2:                  null,
    codigoActividad:            null,
    esEmpadronado:              null,
});

const obtenerListaDePacientes = async (textoBusqueda = '') => {
    const now = Date.now();
    if (!textoBusqueda && _cachePacientes.data && (now - _cachePacientes.ts) < _CACHE_TTL) {
        return _cachePacientes.data;
    }
    try {
        const respuesta = await axios.post(apiObtenerPacientes, {
            identificador: getSucursalIdentificador(),
            textoBusqueda,
        });
        if (respuesta.status === 200 && respuesta.data?.esCorrecto) {
            const lista = respuesta.data.laListaDePacientes || [];
            if (!textoBusqueda) _cachePacientes = { data: lista, ts: Date.now() };
            return lista;
        }
        console.log('ObtenerPaciente esCorrecto:false —', respuesta.data?.mensaje);
        return [];
    } catch (error) {
        console.log('Error en obtenerListaDePacientes:', error);
        return [];
    }
};

const AgregarPaciente = async (form) => {
    try {
        const respuesta = await axios.post(apiAgregarPacientes, buildDto(form, 0));
        invalidarCache();
        return respuesta.data;
    } catch (error) {
        console.log('Error en AgregarPaciente:', error);
        return { esCorrecto: false, mensaje: 'Error al crear el paciente' };
    }
};

const ModificarPaciente = async (form, noPaciente) => {
    try {
        const respuesta = await axios.post(apiModificarPacientes, buildDto(form, noPaciente));
        invalidarCache();
        return respuesta.data;
    } catch (error) {
        console.log('Error en ModificarPaciente:', error);
        return { esCorrecto: false, mensaje: 'Error al modificar el paciente' };
    }
};

const ModificarEstadoPaciente = async (noPaciente, esActivo, identificador) => {
    try {
        const respuesta = await axios.post(apiModificarEstadoPaciente, {
            noPaciente,
            identificador: identificador ?? getSucursalIdentificador(),
            esActivo,
            usuario: getCurrentUsername(),
        });
        invalidarCache();
        return respuesta.data;
    } catch (error) {
        console.log('Error en ModificarEstadoPaciente:', error);
        return { esCorrecto: false, mensaje: 'Error al modificar estado del paciente' };
    }
};

export { obtenerListaDePacientes, AgregarPaciente, ModificarPaciente, ModificarEstadoPaciente };