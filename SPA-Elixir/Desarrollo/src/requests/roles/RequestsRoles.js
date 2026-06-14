import axios from 'axios';
import {
    apiObtenerRoles,
    apiObtenerRolPorId,
    apiCrearRol,
    apiCambiarEstadoRol,
    apiObtenerModulos,
    apiObtenerPermisos,
    apiObtenerPermisosDelRol,
    apiAsignarPermisoARol,
    apiCambiarEstadoPermisoDeRol,
    apiAsignarRolAUsuario,
    apiDesvincularRolDelUsuario,
    apiObtenerRolesDelUsuario,
} from './DireccionesRequest';
import {
    ejemploListaRoles,
    ejemploListaModulos,
    ejemploListaPermisos,
    responseCrearRol,
    responseEliminarRol,
    responseAsignarRol,
    responseDesvincularRol,
    ejemploRolesDelUsuario,
} from '../../views/seguridad/ejemplosDatos';
import { getCurrentUsername } from '../../utils/session';

axios.interceptors.request.use(async (config) => {
    config.headers = {
        'Content-Type': 'application/json',
        Accept: 'application/json'
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

let _cacheRoles = { data: null, ts: 0 };
const _CACHE_TTL = 30 * 1000; // 30 seconds

const getValidationResponse = (response, fallbackMessage = 'Operación completada') => {
    const mensaje = response?.mensaje ?? response?.Mensaje ?? fallbackMessage;
    const esCorrecto = response?.esCorrecto ?? response?.EsCorrecto ?? false;

    return {
        ...response,
        mensaje,
        esCorrecto,
        Mensaje: mensaje,
        EsCorrecto: esCorrecto,
    };
};

const normalizeRol = (rol = {}) => {
    const id = rol.id ?? rol.idRol;
    const activo = rol.activo ?? rol.esActivo ?? true;

    return {
        ...rol,
        id,
        idRol: rol.idRol ?? id,
        activo,
        esActivo: activo,
    };
};

const normalizePermiso = (permiso = {}) => {
    const id = permiso.id ?? permiso.idPermiso;
    const moduloId = permiso.moduloId ?? permiso.idModulo;
    const moduloNombre = permiso.moduloNombre ?? permiso.nombreModulo;
    const activo = permiso.activo ?? permiso.esActivo ?? true;

    return {
        ...permiso,
        id,
        idPermiso: permiso.idPermiso ?? id,
        moduloId,
        idModulo: permiso.idModulo ?? moduloId,
        moduloNombre,
        nombreModulo: permiso.nombreModulo ?? moduloNombre,
        activo,
        esActivo: activo,
    };
};

const normalizePermisoDeRol = (permiso = {}) => {
    const idPermiso = permiso.idPermiso ?? permiso.id;
    const activo = permiso.activo ?? permiso.esActivo ?? true;

    return {
        ...permiso,
        id: idPermiso,
        idPermiso,
        idRolPermiso: permiso.idRolPermiso,
        nombre: permiso.nombre ?? permiso.nombrePermiso,
        nombrePermiso: permiso.nombrePermiso ?? permiso.nombre,
        codigo: permiso.codigo ?? permiso.codigoPermiso,
        codigoPermiso: permiso.codigoPermiso ?? permiso.codigo,
        activo,
        esActivo: activo,
    };
};

const normalizeRolDeUsuario = (rol = {}) => {
    const id = rol.id ?? rol.idRol;
    const activo = rol.activo ?? rol.esActivo ?? true;

    return {
        ...rol,
        id,
        idRol: rol.idRol ?? id,
        idUsuarioRol: rol.idUsuarioRol,
        nombre: rol.nombre ?? rol.nombreRol,
        nombreRol: rol.nombreRol ?? rol.nombre,
        activo,
        esActivo: activo,
    };
};

const extractCollection = (responseData, key) => {
    if (Array.isArray(responseData)) return responseData;
    if (Array.isArray(responseData?.[key])) return responseData[key];
    return [];
};

const invalidateRolesCache = () => {
    _cacheRoles = { data: null, ts: 0 };
};

const getRequestUser = () => getCurrentUsername();

const obtenerPermisosDelRol = async (rolId) => {
    const urlApi = `${apiObtenerPermisosDelRol}${rolId}/permisos`;

    try {
        const respuesta = await axios.get(urlApi);
        if (respuesta.status !== 200) {
            return [];
        }

        return extractCollection(respuesta.data, 'permisos').map(normalizePermisoDeRol);
    } catch (error) {
        console.log('Error al obtener permisos del rol: ' + error);
        return [];
    }
};

const sincronizarPermisosDelRol = async (rolId, permisosSeleccionados = []) => {
    const permisosActuales = await obtenerPermisosDelRol(rolId);
    const permisosSeleccionadosIds = new Set(permisosSeleccionados.map((permisoId) => Number(permisoId)));
    const operaciones = [];

    for (const permisoActual of permisosActuales) {
        const permisoId = Number(permisoActual.idPermiso);
        const debeEstarActivo = permisosSeleccionadosIds.has(permisoId);

        if (permisoActual.idRolPermiso && permisoActual.esActivo !== debeEstarActivo) {
            operaciones.push(
                axios.post(apiCambiarEstadoPermisoDeRol, {
                    idRolPermiso: permisoActual.idRolPermiso,
                    esActivo: debeEstarActivo,
                    usuario: getRequestUser(),
                })
            );
        }

        permisosSeleccionadosIds.delete(permisoId);
    }

    for (const permisoId of permisosSeleccionadosIds) {
        operaciones.push(
            axios.post(apiAsignarPermisoARol, {
                idRol: rolId,
                idPermiso: permisoId,
                usuario: getRequestUser(),
            })
        );
    }

    if (operaciones.length === 0) {
        return getValidationResponse({ esCorrecto: true, mensaje: 'Sin cambios en permisos' });
    }

    try {
        const respuestas = await Promise.all(operaciones);
        const resultados = respuestas.map((respuesta) => getValidationResponse(respuesta.data));
        const errores = resultados.filter((resultado) => !resultado.esCorrecto);

        if (errores.length > 0) {
            return getValidationResponse({
                esCorrecto: false,
                mensaje: errores[0]?.mensaje ?? 'No se pudieron sincronizar los permisos del rol',
            });
        }

        return getValidationResponse({ esCorrecto: true, mensaje: 'Permisos actualizados correctamente' });
    } catch (error) {
        console.log('Error al sincronizar permisos del rol: ' + error);
        return getValidationResponse({
            esCorrecto: false,
            mensaje: 'No se pudieron sincronizar los permisos del rol',
        });
    }
};

const obtenerListaDeRoles = async () => {
    if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploListaRoles;

    const urlApi = `${apiObtenerRoles}`;
    const now = Date.now();
    if (_cacheRoles.data && (now - _cacheRoles.ts) < _CACHE_TTL) {
        return _cacheRoles.data;
    }
    try {
        const respuesta = await axios.get(urlApi);
        if (respuesta.status === 200) {
            const roles = extractCollection(respuesta.data, 'roles').map(normalizeRol);
            _cacheRoles = { data: roles, ts: Date.now() };
            return roles;
        }
    } catch (error) {
        console.log('Error en obtenerListaDeRoles: ' + error);
        return [];
    }

    return [];
};

const obtenerRolPorId = async (rolId) => {
    const urlApi = `${apiObtenerRolPorId}${rolId}`;
    try {
        const [respuestaRol, permisos] = await Promise.all([
            axios.get(urlApi),
            obtenerPermisosDelRol(rolId),
        ]);

        if (respuestaRol.status === 200) {
            const rol = extractCollection(respuestaRol.data, 'roles')
                .map(normalizeRol)
                .find((item) => Number(item.id) === Number(rolId));

            return rol ? { ...rol, permisos } : null;
        }
    } catch (error) {
        console.log('Error en obtenerRolPorId: ' + error);
        return null;
    }

    return null;
};

const crearRol = async (rol) => {
    const urlApi = `${apiCrearRol}`;

    try {
        const respuesta = await axios.post(urlApi, {
            nombre: rol.nombre,
            descripcion: rol.descripcion || null,
            usuario: getRequestUser(),
        });

        const resultado = getValidationResponse(respuesta.data, 'Rol creado correctamente');
        if (!resultado.esCorrecto) {
            return resultado;
        }

        invalidateRolesCache();

        const roles = await obtenerListaDeRoles();
        const rolCreado = roles.find(
            (item) => item.nombre?.trim().toLowerCase() === rol.nombre?.trim().toLowerCase()
        );

        if (!rolCreado) {
            return getValidationResponse({
                esCorrecto: false,
                mensaje: 'El rol fue creado, pero no se pudo recuperar para asignar permisos',
            });
        }

        const permisosResultado = await sincronizarPermisosDelRol(rolCreado.id, rol.permisos || []);
        if (!permisosResultado.esCorrecto) {
            return permisosResultado;
        }

        return getValidationResponse({
            esCorrecto: true,
            mensaje: resultado.mensaje,
            data: rolCreado,
        });
    } catch (error) {
        console.log('Error en crearRol: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') return getValidationResponse(responseCrearRol);
        return getValidationResponse({
            esCorrecto: false,
            mensaje: 'No se pudo crear el rol',
        });
    }
};

const actualizarRol = async (rolId, rol) => {
    try {
        const resultado = await sincronizarPermisosDelRol(rolId, rol.permisos || []);
        if (resultado.esCorrecto) {
            invalidateRolesCache();
        }

        return resultado;
    } catch (error) {
        console.log('Error en actualizarRol: ' + error);
        return getValidationResponse({
            esCorrecto: false,
            mensaje: 'No se pudieron actualizar los permisos del rol',
        });
    }
};

const eliminarRol = async (rolId, esActivo = false) => {
    try {
        const respuesta = await axios.post(apiCambiarEstadoRol, {
            idRol: rolId,
            esActivo,
            usuario: getRequestUser(),
        });

        invalidateRolesCache();
        return getValidationResponse(respuesta.data, esActivo ? 'Rol activado correctamente' : 'Rol inactivado correctamente');
    } catch (error) {
        console.log('Error en eliminarRol: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') return getValidationResponse(responseEliminarRol);
        return getValidationResponse({
            esCorrecto: false,
            mensaje: esActivo ? 'No se pudo activar el rol' : 'No se pudo inactivar el rol',
        });
    }
};

const obtenerModulos = async () => {
    if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploListaModulos;

    const urlApi = `${apiObtenerModulos}`;
    try {
        const respuesta = await axios.get(urlApi);
        if (respuesta.status === 200) {
            return extractCollection(respuesta.data, 'modulos');
        }
    } catch (error) {
        console.log('Error en obtenerModulos: ' + error);
        return [];
    }

    return [];
};

const obtenerPermisos = async () => {
    if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploListaPermisos;

    const urlApi = `${apiObtenerPermisos}`;
    try {
        const respuesta = await axios.get(urlApi);
        if (respuesta.status === 200) {
            return extractCollection(respuesta.data, 'permisos').map(normalizePermiso);
        }
    } catch (error) {
        console.log('Error en obtenerPermisos: ' + error);
        return [];
    }

    return [];
};

const asignarRolAUsuario = async (usuarioId, rolId) => {
    try {
        const respuesta = await axios.post(`${apiAsignarRolAUsuario}${usuarioId}/roles`, {
            idRol: rolId,
            usuario: getRequestUser(),
        });

        return getValidationResponse(respuesta.data, 'Rol asignado correctamente');
    } catch (error) {
        console.log('Error en asignarRolAUsuario: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') return getValidationResponse(responseAsignarRol);
        return getValidationResponse({
            esCorrecto: false,
            mensaje: 'No se pudo asignar el rol al usuario',
        });
    }
};

const desvincularRolDelUsuario = async (usuarioId, idUsuarioRol, esActivo = false) => {
    try {
        const respuesta = await axios.post(`${apiDesvincularRolDelUsuario}${usuarioId}/roles/estado`, {
            idUsuarioRol,
            esActivo,
            usuario: getRequestUser(),
        });

        return getValidationResponse(respuesta.data, esActivo ? 'Rol reactivado correctamente' : 'Rol desvinculado correctamente');
    } catch (error) {
        console.log('Error en desvincularRolDelUsuario: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') return getValidationResponse(responseDesvincularRol);
        return getValidationResponse({
            esCorrecto: false,
            mensaje: esActivo ? 'No se pudo reactivar el rol del usuario' : 'No se pudo desvincular el rol del usuario',
        });
    }
};

const obtenerRolesDelUsuario = async (usuarioId) => {
    try {
        const respuesta = await axios.get(`${apiObtenerRolesDelUsuario}${usuarioId}/roles`);
        if (respuesta.status === 200) {
            return extractCollection(respuesta.data, 'roles').map(normalizeRolDeUsuario);
        }
    } catch (error) {
        console.log('Error en obtenerRolesDelUsuario: ' + error);
        if (import.meta.env.VITE_USE_MOCK === 'true') return ejemploRolesDelUsuario;
        return [];
    }

    return [];
};

export {
    obtenerListaDeRoles,
    obtenerRolPorId,
    crearRol,
    actualizarRol,
    eliminarRol,
    obtenerModulos,
    obtenerPermisos,
    obtenerPermisosDelRol,
    asignarRolAUsuario,
    desvincularRolDelUsuario,
    obtenerRolesDelUsuario
};
