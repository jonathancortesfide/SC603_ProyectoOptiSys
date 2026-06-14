import axios from 'axios';
import {
    apiObtenerUsuarios,
    apiObtenerUsuarioPorId,
    apiObtenerUsuarioPorCorreo,
    apiAgregarUsuario,
    apiModificarUsuario,
    apiModificarEstadoUsuario,
} from './DireccionesRequest';
import { getSucursalIdentificador } from '../../utils/sucursal';
import { getCurrentUsername } from '../../utils/session';

const getValidationResponse = (response, fallbackMessage = 'Operación completada') => {
    const mensaje = response?.mensaje ?? response?.Mensaje ?? fallbackMessage;
    const esCorrecto = response?.esCorrecto ?? response?.EsCorrecto ?? false;

    return {
        ...response,
        mensaje,
        esCorrecto,
        // PascalCase aliases for backwards compatibility
        Mensaje: mensaje,
        EsCorrecto: esCorrecto,
    };
};

const getRequestUser = () => getCurrentUsername() || 'sistema';

// Simple in-memory cache for the full-list endpoint (no search filter)
let _cacheUsuarios = { data: null, ts: 0 };
const _CACHE_TTL = 30 * 1000; // 30 seconds

const invalidateUsuariosCache = () => {
    _cacheUsuarios = { data: null, ts: 0 };
};

/**
 * POST /api/Usuario/ObtenerUsuario
 * Returns all users for the current branch.
 * Pass `descripcion` to filter by partial name on the server side.
 */
const obtenerListaDeUsuarios = async (descripcion = '') => {
    const now = Date.now();
    if (!descripcion && _cacheUsuarios.data && (now - _cacheUsuarios.ts) < _CACHE_TTL) {
        return _cacheUsuarios.data;
    }

    try {
        const respuesta = await axios.post(apiObtenerUsuarios, {
            identificador: getSucursalIdentificador(),
            descripcion,
        });

        if (respuesta.status === 200 && respuesta.data?.esCorrecto) {
            const usuarios = respuesta.data.listaUsuarios || [];
            if (!descripcion) {
                _cacheUsuarios = { data: usuarios, ts: Date.now() };
            }
            return usuarios;
        }

        console.log('ObtenerUsuario respondió esCorrecto:false —', respuesta.data?.mensaje);
        return [];
    } catch (error) {
        console.log('Error en obtenerListaDeUsuarios:', error);
        return [];
    }
};

/**
 * POST /api/Usuario/ObtenerUsuarioPorId
 * Returns a single user by numeric ID. Response key: `datos`.
 */
const obtenerUsuarioPorId = async (idUsuario) => {
    try {
        const respuesta = await axios.post(apiObtenerUsuarioPorId, { idUsuario });
        if (respuesta.status === 200 && respuesta.data?.esCorrecto) {
            return respuesta.data.datos || null;
        }
        return null;
    } catch (error) {
        console.log('Error en obtenerUsuarioPorId:', error);
        return null;
    }
};

/**
 * POST /api/Usuario/ObtenerUsuarioPorCorreo
 * Returns a single user by email. Response key: `datos`.
 * Use after OAuth login to resolve idUsuario from the email claim.
 */
const obtenerUsuarioPorCorreo = async (email) => {
    try {
        const respuesta = await axios.post(apiObtenerUsuarioPorCorreo, { email });
        if (respuesta.status === 200 && respuesta.data?.esCorrecto) {
            return respuesta.data.datos || null;
        }
        return null;
    } catch (error) {
        console.log('Error en obtenerUsuarioPorCorreo:', error);
        return null;
    }
};

/**
 * POST /api/Usuario/AgregarUsuario
 * Creates a new user record (identity provider account must already exist).
 */
const crearUsuario = async (usuario) => {
    try {
        const respuesta = await axios.post(apiAgregarUsuario, {
            idIdentityServer: usuario.idIdentityServer || '',
            identificador: getSucursalIdentificador(),
            nombre: usuario.nombre,
            esDoctor: usuario.esDoctor || false,
            codigoProfesional: usuario.codigoProfesional || null,
            email: usuario.email,
            telefono: usuario.telefono || null,
            direccion: usuario.direccion || null,
            fechaNacimiento: usuario.fechaNacimiento || null,
            esActivo: usuario.esActivo !== undefined ? usuario.esActivo : true,
            usuario: getRequestUser(),
        });

        const resultado = getValidationResponse(respuesta.data, 'Usuario creado correctamente');
        if (resultado.esCorrecto) invalidateUsuariosCache();
        return resultado;
    } catch (error) {
        console.log('Error en crearUsuario:', error);
        return getValidationResponse({ esCorrecto: false, mensaje: 'No se pudo crear el usuario' });
    }
};

/**
 * POST /api/Usuario/ModificarUsuario
 * Updates an existing user. Filtered by `idUsuario`.
 */
const actualizarUsuario = async (idUsuario, usuario) => {
    try {
        const respuesta = await axios.post(apiModificarUsuario, {
            idUsuario,
            idIdentityServer: usuario.idIdentityServer || '',
            identificador: getSucursalIdentificador(),
            nombre: usuario.nombre,
            esDoctor: usuario.esDoctor || false,
            codigoProfesional: usuario.codigoProfesional || null,
            email: usuario.email,
            telefono: usuario.telefono || null,
            direccion: usuario.direccion || null,
            fechaNacimiento: usuario.fechaNacimiento || null,
            usuario: getRequestUser(),
        });

        const resultado = getValidationResponse(respuesta.data, 'Usuario actualizado correctamente');
        if (resultado.esCorrecto) invalidateUsuariosCache();
        return resultado;
    } catch (error) {
        console.log('Error en actualizarUsuario:', error);
        return getValidationResponse({ esCorrecto: false, mensaje: 'No se pudo actualizar el usuario' });
    }
};

/**
 * POST /api/Usuario/ModificarEstadoUsuario
 * Activates or inactivates a user account.
 */
const modificarEstadoUsuario = async (idUsuario, esActivo) => {
    try {
        const respuesta = await axios.post(apiModificarEstadoUsuario, {
            idUsuario,
            esActivo,
            usuario: getRequestUser(),
            identificador: getSucursalIdentificador(),
        });

        const resultado = getValidationResponse(
            respuesta.data,
            esActivo ? 'Usuario activado correctamente' : 'Usuario inactivado correctamente'
        );
        if (resultado.esCorrecto) invalidateUsuariosCache();
        return resultado;
    } catch (error) {
        console.log('Error en modificarEstadoUsuario:', error);
        return getValidationResponse({
            esCorrecto: false,
            mensaje: esActivo ? 'No se pudo activar el usuario' : 'No se pudo inactivar el usuario',
        });
    }
};

export {
    obtenerListaDeUsuarios,
    obtenerUsuarioPorId,
    obtenerUsuarioPorCorreo,
    crearUsuario,
    actualizarUsuario,
    modificarEstadoUsuario,
};
