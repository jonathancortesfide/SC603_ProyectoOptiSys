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

export const responseDesvincularRol = {
    Mensaje: "Rol desvinculado exitosamente",
    EsCorrecto: true
};

// ============================================
// PACIENTES
// ============================================

export const ejemploListaPacientes = [
    {
        id: 'pac-001',
        numeroDePaciente: 1001,
        tipoIdentificacion: 'fisica',
        identificacion: '1-2345-6789',
        cedula: '1-2345-6789',
        nombre: 'Carlos Ramírez González',
        nombreComercial: '',
        direccion: 'San José, Costa Rica',
        fechaNacimiento: '1980-03-15',
        email: 'carlos.ramirez@example.com',
        email1: 'carlos.ramirez@example.com',
        email2: '',
        telefono1: '+506 8888-9999',
        telefono2: '',
        sexo: 'M',
        esEmpadronado: true,
        listaPrecio: 'Estándar',
        esActivo: true,
        codigoActividadEconomica: '',
        esValidadoHacienda: false,
        noEnviaFacturaElectronica: false,
        plazo: 30,
        limiteCredito: 50000,
        bloqueoFacturasCredito: false,
        permitirFacturasSaldoVencido: false,
        contactoEmergenciaNombre: 'María Ramírez',
        contactoEmergenciaTelefono: '+506 7777-8888',
        observaciones: '',
        bloqueoFacturasContado: false,
        clasificacion: 'A',
        nacionalidad: 'Costarricense',
        formatoFacturaEspecial: false,
        enviaCumpleanos: true
    },
    {
        id: 'pac-002',
        numeroDePaciente: 1002,
        tipoIdentificacion: 'fisica',
        identificacion: '2-3456-7890',
        cedula: '2-3456-7890',
        nombre: 'Ana María Solís Pérez',
        nombreComercial: '',
        direccion: 'Heredia, Costa Rica',
        fechaNacimiento: '1992-07-22',
        email: 'ana.solis@example.com',
        email1: 'ana.solis@example.com',
        email2: 'asolis@work.com',
        telefono1: '+506 6666-5555',
        telefono2: '+506 2222-3333',
        sexo: 'F',
        esEmpadronado: false,
        listaPrecio: 'Premium',
        esActivo: true,
        codigoActividadEconomica: '',
        esValidadoHacienda: false,
        noEnviaFacturaElectronica: false,
        plazo: 15,
        limiteCredito: 25000,
        bloqueoFacturasCredito: false,
        permitirFacturasSaldoVencido: false,
        contactoEmergenciaNombre: 'Pedro Solís',
        contactoEmergenciaTelefono: '+506 5555-4444',
        observaciones: 'Cliente preferencial',
        bloqueoFacturasContado: false,
        clasificacion: 'B',
        nacionalidad: 'Costarricense',
        formatoFacturaEspecial: false,
        enviaCumpleanos: true
    },
    {
        id: 'pac-003',
        numeroDePaciente: 1003,
        tipoIdentificacion: 'juridica',
        identificacion: '3-101-234567',
        cedula: '3-101-234567',
        nombre: 'Óptica Visión Clara S.A.',
        nombreComercial: 'Visión Clara',
        direccion: 'Cartago, Costa Rica',
        fechaNacimiento: '',
        email: 'contacto@visionclara.com',
        email1: 'contacto@visionclara.com',
        email2: '',
        telefono1: '+506 2591-0000',
        telefono2: '',
        sexo: '',
        esEmpadronado: true,
        listaPrecio: 'Mayoreo',
        esActivo: true,
        codigoActividadEconomica: '4774',
        esValidadoHacienda: true,
        noEnviaFacturaElectronica: false,
        plazo: 60,
        limiteCredito: 100000,
        bloqueoFacturasCredito: false,
        permitirFacturasSaldoVencido: true,
        contactoEmergenciaNombre: 'Roberto Castro',
        contactoEmergenciaTelefono: '+506 8888-7777',
        observaciones: 'Empresa cliente corporativo',
        bloqueoFacturasContado: false,
        clasificacion: 'A+',
        nacionalidad: 'Costarricense',
        formatoFacturaEspecial: true,
        enviaCumpleanos: false
    }
];

// ============================================
// PACIENTES - CUENTAS (MOCK)
// ============================================

export const ejemploCuentasPaciente = [
    {
        moneda: 'CRC',
        saldo: 12500.50,
        facturas: [
            { noFactura: 'F-1001', noExamen: 'EX-5001', fecha: '2025-10-01', moneda: 'CRC', monto: 2500.50, saldo: 500.50 },
            { noFactura: 'F-1002', noExamen: 'EX-5002', fecha: '2025-09-15', moneda: 'CRC', monto: 5000.00, saldo: 5000.00 },
        ],
        creditos: [
            { noDocumento: 'C-2001', fecha: '2025-08-01', tipoDocumento: 'Nota de crédito', moneda: 'CRC', monto: 1000.00, saldo: 0.00 },
            { noDocumento: 'C-2002', fecha: '2025-07-20', tipoDocumento: 'Recibo', moneda: 'CRC', monto: 200.00, saldo: 200.00 },
        ]
    },
    {
        moneda: 'USD',
        saldo: 300.00,
        facturas: [
            { noFactura: 'F-2001', noExamen: 'EX-6001', fecha: '2025-11-05', moneda: 'USD', monto: 300.00, saldo: 300.00 }
        ],
        creditos: []
    }
];

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

// ============================================
// PRODUCTOS (MOCK)
// ============================================
export const ejemploListaProductos = [
    {
        id: 'prod-001',
        tipoArticulo: 'Material',
        tipoImpuesto: 'IVA',
        porcentajeImpuesto: 13,
        codigoInterno: 'P-1001',
        codigoBarras: '789100000001',
        codigoAuxiliar: 'A-1001',
        nombre: 'Lente Simple 1.5',
        codigoCabys: '1234567890',
        esActivo: true,
        unidadMedida: 'Unidad',
        grupo: 'Lentes',
        marca: 'MarcaA',
        tipoLente: 'Monofocal',
        existencia: 25,
        caracteristicas: 'Lente para corrección simple',
        foto: '',
        minimo: 2,
        esPerecedero: false,
        costoPromedioPonderado: 5.5,
        costoUltimaCompra: 6.0,
        costoFinal: 6.5,
        listasPrecios: [
            { nombre: 'Retail', utilidad: 50, precioNeto: 9.75, precioCliente: 11.03 }
        ]
    },
    {
        id: 'prod-002',
        tipoArticulo: 'Servicio',
        tipoImpuesto: 'Exento',
        porcentajeImpuesto: 0,
        codigoInterno: 'P-2001',
        codigoBarras: '',
        codigoAuxiliar: '',
        nombre: 'Consulta Oftalmológica',
        codigoCabys: '0987654321',
        esActivo: true,
        unidadMedida: 'Servicio',
        grupo: 'Servicios',
        marca: '',
        tipoLente: '',
        existencia: 0,
        caracteristicas: 'Consulta especializada',
        foto: '',
        minimo: 0,
        esPerecedero: false,
        costoPromedioPonderado: 0,
        costoUltimaCompra: 0,
        costoFinal: 0,
        listasPrecios: [
            { nombre: 'Standard', utilidad: 100, precioNeto: 30, precioCliente: 33.9 }
        ]
    }
];
