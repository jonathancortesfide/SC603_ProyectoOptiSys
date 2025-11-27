/**
 * EJEMPLOS DE RESPUESTAS DE API ESPERADAS
 * Este archivo muestra la estructura de datos que el backend debe devolver
 */

// ============================================
// USUARIOS
// ============================================

// GET /api/usuarios/
// Obtener lista de usuarios
export const ejemploListaUsuarios = [
    {
        id: "user-001",
        login: "jdoe",
        email: "john.doe@example.com",
        nombre: "John Doe",
        esDoctor: true,
        codigoProfesional: "MED-12345",
        telefono: "+34 123 456 789",
        direccion: "Calle Principal 123, Madrid",
        fechaNacimiento: "1985-05-15",
        esActivo: true
    },
    {
        id: "user-002",
        login: "msmith",
        email: "maria.smith@example.com",
        nombre: "María Smith",
        esDoctor: false,
        codigoProfesional: null,
        telefono: "+34 987 654 321",
        direccion: "Avenida Central 456, Barcelona",
        fechaNacimiento: "1990-08-22",
        esActivo: true
    }
];

// GET /api/usuarios/{id}
// Obtener usuario por ID
export const ejemploUsuario = {
    id: "user-001",
    login: "jdoe",
    email: "john.doe@example.com",
    nombre: "John Doe",
    esDoctor: true,
    codigoProfesional: "MED-12345",
    telefono: "+34 123 456 789",
    direccion: "Calle Principal 123, Madrid",
    fechaNacimiento: "1985-05-15",
    esActivo: true
};

// POST /api/usuarios/ - Crear usuario
// REQUEST
export const requestCrearUsuario = {
    login: "newuser",
    email: "new@example.com",
    contrasena: "SecurePassword123",
    nombre: "New User",
    esDoctor: false,
    codigoProfesional: null,
    telefono: "+34 111 222 333",
    direccion: "Nueva Dirección 789",
    fechaNacimiento: "1992-12-10",
    esActivo: true
};

// RESPONSE
export const responseCrearUsuario = {
    Mensaje: "Usuario creado exitosamente",
    EsCorrecto: true,
    Data: {
        id: "user-003",
        login: "newuser",
        email: "new@example.com",
        nombre: "New User",
        esDoctor: false,
        codigoProfesional: null,
        telefono: "+34 111 222 333",
        direccion: "Nueva Dirección 789",
        fechaNacimiento: "1992-12-10",
        esActivo: true
    }
};

// PUT /api/usuarios/{id} - Actualizar usuario
// REQUEST
export const requestActualizarUsuario = {
    email: "john.updated@example.com",
    nombre: "John Doe Updated",
    esDoctor: true,
    codigoProfesional: "MED-12346",
    telefono: "+34 123 456 790",
    direccion: "Calle Principal 124, Madrid",
    fechaNacimiento: "1985-05-15",
    esActivo: true
};

// RESPONSE
export const responseActualizarUsuario = {
    Mensaje: "Usuario actualizado exitosamente",
    EsCorrecto: true,
    Data: {
        id: "user-001",
        login: "jdoe",
        email: "john.updated@example.com",
        nombre: "John Doe Updated",
        esDoctor: true,
        codigoProfesional: "MED-12346",
        telefono: "+34 123 456 790",
        direccion: "Calle Principal 124, Madrid",
        fechaNacimiento: "1985-05-15",
        esActivo: true
    }
};

// POST /api/usuarios/cambiar-contrasena/{id}
// REQUEST
export const requestCambiarContrasena = {
    contrasenaActual: "OldPassword123",
    contrasenaNueva: "NewPassword456"
};

// RESPONSE
export const responseCambiarContrasena = {
    Mensaje: "Contraseña cambiada exitosamente",
    EsCorrecto: true
};

// DELETE /api/usuarios/{id}
// RESPONSE
export const responseEliminarUsuario = {
    Mensaje: "Usuario eliminado exitosamente",
    EsCorrecto: true
};

// GET /api/usuarios/buscar/?parametro=john
// RESPONSE
export const responseBuscarUsuarios = [
    {
        id: "user-001",
        login: "jdoe",
        email: "john.doe@example.com",
        nombre: "John Doe",
        esDoctor: true,
        codigoProfesional: "MED-12345",
        telefono: "+34 123 456 789",
        direccion: "Calle Principal 123, Madrid",
        fechaNacimiento: "1985-05-15",
        esActivo: true
    }
];

// ============================================
// ROLES
// ============================================

// GET /api/roles/
// Obtener lista de roles
export const ejemploListaRoles = [
    {
        id: "role-001",
        nombre: "Administrador",
        descripcion: "Acceso total al sistema",
        permisos: [
            {
                id: "perm-001",
                nombre: "Ver Usuarios",
                moduloId: "mod-001",
                moduloNombre: "Seguridad",
                descripcion: "Permite ver el listado de usuarios",
                accion: "read"
            },
            {
                id: "perm-002",
                nombre: "Crear Usuarios",
                moduloId: "mod-001",
                moduloNombre: "Seguridad",
                descripcion: "Permite crear nuevos usuarios",
                accion: "create"
            }
        ]
    },
    {
        id: "role-002",
        nombre: "Doctor",
        descripcion: "Acceso limitado para doctores",
        permisos: [
            {
                id: "perm-003",
                nombre: "Ver Pacientes",
                moduloId: "mod-002",
                moduloNombre: "Pacientes",
                descripcion: "Permite ver el listado de pacientes",
                accion: "read"
            }
        ]
    }
];

// GET /api/roles/{id}
// Obtener rol por ID
export const ejemploRol = {
    id: "role-001",
    nombre: "Administrador",
    descripcion: "Acceso total al sistema",
    permisos: [
        {
            id: "perm-001",
            nombre: "Ver Usuarios",
            moduloId: "mod-001",
            moduloNombre: "Seguridad",
            descripcion: "Permite ver el listado de usuarios",
            accion: "read"
        },
        {
            id: "perm-002",
            nombre: "Crear Usuarios",
            moduloId: "mod-001",
            moduloNombre: "Seguridad",
            descripcion: "Permite crear nuevos usuarios",
            accion: "create"
        }
    ]
};

// POST /api/roles/ - Crear rol
// REQUEST
export const requestCrearRol = {
    nombre: "Gerente",
    descripcion: "Acceso limitado para gerentes",
    permisos: ["perm-001", "perm-003"]
};

// RESPONSE
export const responseCrearRol = {
    Mensaje: "Rol creado exitosamente",
    EsCorrecto: true,
    Data: {
        id: "role-003",
        nombre: "Gerente",
        descripcion: "Acceso limitado para gerentes",
        permisos: [
            {
                id: "perm-001",
                nombre: "Ver Usuarios",
                moduloId: "mod-001",
                moduloNombre: "Seguridad",
                descripcion: "Permite ver el listado de usuarios",
                accion: "read"
            },
            {
                id: "perm-003",
                nombre: "Ver Pacientes",
                moduloId: "mod-002",
                moduloNombre: "Pacientes",
                descripcion: "Permite ver el listado de pacientes",
                accion: "read"
            }
        ]
    }
};

// PUT /api/roles/{id} - Actualizar rol
// REQUEST
export const requestActualizarRol = {
    nombre: "Gerente Senior",
    descripcion: "Acceso limitado para gerentes senior",
    permisos: ["perm-001", "perm-002", "perm-003"]
};

// RESPONSE
export const responseActualizarRol = {
    Mensaje: "Rol actualizado exitosamente",
    EsCorrecto: true,
    Data: {
        id: "role-003",
        nombre: "Gerente Senior",
        descripcion: "Acceso limitado para gerentes senior",
        permisos: [
            {
                id: "perm-001",
                nombre: "Ver Usuarios",
                moduloId: "mod-001",
                moduloNombre: "Seguridad",
                descripcion: "Permite ver el listado de usuarios",
                accion: "read"
            },
            {
                id: "perm-002",
                nombre: "Crear Usuarios",
                moduloId: "mod-001",
                moduloNombre: "Seguridad",
                descripcion: "Permite crear nuevos usuarios",
                accion: "create"
            },
            {
                id: "perm-003",
                nombre: "Ver Pacientes",
                moduloId: "mod-002",
                moduloNombre: "Pacientes",
                descripcion: "Permite ver el listado de pacientes",
                accion: "read"
            }
        ]
    }
};

// DELETE /api/roles/{id}
// RESPONSE
export const responseEliminarRol = {
    Mensaje: "Rol eliminado exitosamente",
    EsCorrecto: true
};

// GET /api/permisos/
// Obtener lista de permisos disponibles
export const ejemploListaPermisos = [
    // Módulo: Seguridad
    {
        id: "perm-001",
        nombre: "Ver Usuarios",
        moduloId: "mod-001",
        moduloNombre: "Seguridad",
        descripcion: "Permite ver el listado de usuarios",
        accion: "read"
    },
    {
        id: "perm-002",
        nombre: "Crear Usuarios",
        moduloId: "mod-001",
        moduloNombre: "Seguridad",
        descripcion: "Permite crear nuevos usuarios",
        accion: "create"
    },
    {
        id: "perm-003",
        nombre: "Editar Usuarios",
        moduloId: "mod-001",
        moduloNombre: "Seguridad",
        descripcion: "Permite editar usuarios",
        accion: "update"
    },
    {
        id: "perm-004",
        nombre: "Eliminar Usuarios",
        moduloId: "mod-001",
        moduloNombre: "Seguridad",
        descripcion: "Permite eliminar usuarios",
        accion: "delete"
    },
    // Módulo: Pacientes
    {
        id: "perm-005",
        nombre: "Ver Pacientes",
        moduloId: "mod-002",
        moduloNombre: "Pacientes",
        descripcion: "Permite ver el listado de pacientes",
        accion: "read"
    },
    {
        id: "perm-006",
        nombre: "Crear Pacientes",
        moduloId: "mod-002",
        moduloNombre: "Pacientes",
        descripcion: "Permite crear nuevos pacientes",
        accion: "create"
    }
];

// ============================================
// USUARIO - ROLES
// ============================================

// POST /api/usuarios-roles/asignar/
// REQUEST
export const requestAsignarRol = {
    usuarioId: "user-001",
    rolId: "role-002"
};

// RESPONSE
export const responseAsignarRol = {
    Mensaje: "Rol asignado exitosamente",
    EsCorrecto: true
};

// POST /api/usuarios-roles/desvincular/
// REQUEST
export const requestDesvincularRol = {
    usuarioId: "user-001",
    rolId: "role-002"
};

// RESPONSE
export const responseDesvincularRol = {
    Mensaje: "Rol desvinculado exitosamente",
    EsCorrecto: true
};

// GET /api/usuarios-roles/usuario/{usuarioId}
// Obtener roles de un usuario
export const ejemploRolesDelUsuario = [
    {
        id: "role-001",
        nombre: "Administrador",
        descripcion: "Acceso total al sistema"
    },
    {
        id: "role-002",
        nombre: "Doctor",
        descripcion: "Acceso limitado para doctores"
    }
];
