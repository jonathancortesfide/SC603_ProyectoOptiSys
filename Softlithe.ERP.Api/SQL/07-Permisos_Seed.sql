-- =============================================
-- SEED DE PERMISOS DEL SISTEMA
-- Secciones, Módulos, Permisos y Roles base
-- Idempotente: usa WHERE NOT EXISTS para no duplicar
-- =============================================

BEGIN TRANSACTION;
BEGIN TRY

-- =============================================
-- 1. SECCIONES
-- =============================================

INSERT INTO [dbo].[Seccion] ([nombre], [activo])
SELECT v.[nombre], 1
FROM (VALUES
    ('Clínica'),
    ('Inventario'),
    ('Ventas'),
    ('Mantenimientos'),
    ('Seguridad'),
    ('Empresa')
) AS v([nombre])
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Seccion] s WHERE s.[nombre] = v.[nombre]
);

-- =============================================
-- 2. MÓDULOS
-- =============================================

-- Sección: Clínica
INSERT INTO [dbo].[Modulo] ([nombre], [descripcion], [id_seccion], [activo])
SELECT v.[nombre], v.[descripcion], s.[id_seccion], 1
FROM (VALUES
    ('Pacientes',  'Gestión de expedientes de pacientes'),
    ('Examenes',   'Registro y consulta de exámenes de la vista')
) AS v([nombre], [descripcion])
INNER JOIN [dbo].[Seccion] s ON s.[nombre] = 'Clínica'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Modulo] m WHERE m.[nombre] = v.[nombre] AND m.[id_seccion] = s.[id_seccion]
);

-- Sección: Inventario
INSERT INTO [dbo].[Modulo] ([nombre], [descripcion], [id_seccion], [activo])
SELECT v.[nombre], v.[descripcion], s.[id_seccion], 1
FROM (VALUES
    ('Productos',  'Catálogo de productos y servicios'),
    ('Bodegas',    'Administración de bodegas y ubicaciones de inventario')
) AS v([nombre], [descripcion])
INNER JOIN [dbo].[Seccion] s ON s.[nombre] = 'Inventario'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Modulo] m WHERE m.[nombre] = v.[nombre] AND m.[id_seccion] = s.[id_seccion]
);

-- Sección: Ventas
INSERT INTO [dbo].[Modulo] ([nombre], [descripcion], [id_seccion], [activo])
SELECT v.[nombre], v.[descripcion], s.[id_seccion], 1
FROM (VALUES
    ('Facturación',          'Emisión y consulta de facturas'),
    ('Cajas',                'Administración de cajas registradoras'),
    ('Movimientos de Caja',  'Apertura, cierre y movimientos de caja')
) AS v([nombre], [descripcion])
INNER JOIN [dbo].[Seccion] s ON s.[nombre] = 'Ventas'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Modulo] m WHERE m.[nombre] = v.[nombre] AND m.[id_seccion] = s.[id_seccion]
);

-- Sección: Mantenimientos
INSERT INTO [dbo].[Modulo] ([nombre], [descripcion], [id_seccion], [activo])
SELECT v.[nombre], v.[descripcion], s.[id_seccion], 1
FROM (VALUES
    ('Monedas',                   'Catálogo de monedas y tipos de cambio'),
    ('Enfermedades',              'Catálogo de enfermedades y padecimientos'),
    ('Marcas',                    'Catálogo de marcas de productos'),
    ('Grupos de Productos',       'Agrupación de productos por categoría'),
    ('Lista de Precios',          'Gestión de listas de precios'),
    ('Tipo de Lente',             'Catálogo de tipos de lente'),
    ('Clasificación de Pacientes','Catálogo de clasificaciones para pacientes'),
    ('Proveedores',               'Registro y gestión de proveedores'),
    ('Vendedores',                'Registro y gestión de vendedores'),
    ('Países',                    'Catálogo de países')
) AS v([nombre], [descripcion])
INNER JOIN [dbo].[Seccion] s ON s.[nombre] = 'Mantenimientos'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Modulo] m WHERE m.[nombre] = v.[nombre] AND m.[id_seccion] = s.[id_seccion]
);

-- Sección: Seguridad
INSERT INTO [dbo].[Modulo] ([nombre], [descripcion], [id_seccion], [activo])
SELECT v.[nombre], v.[descripcion], s.[id_seccion], 1
FROM (VALUES
    ('Usuarios',          'Registro y administración de usuarios del sistema'),
    ('Roles y Permisos',  'Gestión de roles, módulos, secciones y permisos')
) AS v([nombre], [descripcion])
INNER JOIN [dbo].[Seccion] s ON s.[nombre] = 'Seguridad'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Modulo] m WHERE m.[nombre] = v.[nombre] AND m.[id_seccion] = s.[id_seccion]
);

-- Sección: Empresa
INSERT INTO [dbo].[Modulo] ([nombre], [descripcion], [id_seccion], [activo])
SELECT v.[nombre], v.[descripcion], s.[id_seccion], 1
FROM (VALUES
    ('Configuración de Empresa', 'Parámetros y configuración general de la empresa'),
    ('Sucursales',               'Registro y gestión de sucursales')
) AS v([nombre], [descripcion])
INNER JOIN [dbo].[Seccion] s ON s.[nombre] = 'Empresa'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Modulo] m WHERE m.[nombre] = v.[nombre] AND m.[id_seccion] = s.[id_seccion]
);

-- =============================================
-- 3. PERMISOS
-- =============================================

-- Módulo: Pacientes
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Pacientes',                      'PACIENTE_VER',                      'Consultar el listado y detalle de pacientes'),
    ('Crear Pacientes',                    'PACIENTE_CREAR',                    'Registrar nuevos pacientes en el sistema'),
    ('Editar Pacientes',                   'PACIENTE_EDITAR',                   'Modificar datos de pacientes existentes'),
    ('Cambiar Estado de Paciente',         'PACIENTE_CAMBIAR_ESTADO',           'Activar o desactivar un paciente'),
    ('Ver Clasificaciones de Paciente',    'PACIENTE_CLASIFICACION_VER',        'Consultar las clasificaciones asignadas a un paciente'),
    ('Agregar Clasificación a Paciente',   'PACIENTE_CLASIFICACION_AGREGAR',    'Asignar una clasificación a un paciente'),
    ('Editar Clasificación de Paciente',   'PACIENTE_CLASIFICACION_EDITAR',     'Modificar una clasificación asignada a un paciente'),
    ('Cambiar Estado de Clasificación',    'PACIENTE_CLASIFICACION_CAMBIAR_ESTADO', 'Activar o desactivar una clasificación de paciente')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Pacientes'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Examenes
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Exámenes',             'EXAMEN_VER',             'Consultar el listado de exámenes de la vista'),
    ('Ver Detalle de Examen',    'EXAMEN_VER_DETALLE',     'Consultar el detalle completo de un examen'),
    ('Crear Examen',             'EXAMEN_CREAR',           'Registrar un nuevo examen de la vista'),
    ('Ver Graduaciones',         'EXAMEN_VER_GRADUACIONES','Consultar las graduaciones de un examen')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Examenes'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Productos
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Productos',            'PRODUCTO_VER',           'Consultar el catálogo de productos'),
    ('Crear Productos',          'PRODUCTO_CREAR',         'Registrar nuevos productos en el catálogo'),
    ('Editar Productos',         'PRODUCTO_EDITAR',        'Modificar datos de productos existentes'),
    ('Cambiar Estado de Producto','PRODUCTO_CAMBIAR_ESTADO','Activar o desactivar un producto')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Productos'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Bodegas
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Bodegas',              'BODEGA_VER',             'Consultar el listado de bodegas'),
    ('Crear Bodegas',            'BODEGA_CREAR',           'Registrar nuevas bodegas'),
    ('Editar Bodegas',           'BODEGA_EDITAR',          'Modificar datos de bodegas existentes'),
    ('Cambiar Estado de Bodega', 'BODEGA_CAMBIAR_ESTADO',  'Activar o desactivar una bodega')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Bodegas'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Facturación
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Facturas',   'FACTURA_VER',   'Consultar el historial de facturas emitidas'),
    ('Crear Facturas', 'FACTURA_CREAR', 'Emitir nuevas facturas de venta')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Facturación'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Cajas
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Cajas',            'CAJA_VER',           'Consultar el listado de cajas'),
    ('Crear Cajas',          'CAJA_CREAR',         'Registrar nuevas cajas registradoras'),
    ('Editar Cajas',         'CAJA_EDITAR',        'Modificar datos de cajas existentes'),
    ('Cambiar Estado de Caja','CAJA_CAMBIAR_ESTADO','Activar o desactivar una caja')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Cajas'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Movimientos de Caja
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Movimientos de Caja',    'CAJA_MOV_VER',        'Consultar los movimientos de caja'),
    ('Registrar Movimiento de Caja','CAJA_MOV_CREAR',     'Registrar ingresos y egresos en caja'),
    ('Apertura de Caja',           'CAJA_MOV_APERTURA',   'Realizar la apertura de turno de caja')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Movimientos de Caja'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Monedas
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Monedas',              'MONEDA_VER',            'Consultar el catálogo de monedas'),
    ('Crear Monedas',            'MONEDA_CREAR',          'Registrar nuevas monedas'),
    ('Editar Monedas',           'MONEDA_EDITAR',         'Modificar datos de monedas existentes'),
    ('Cambiar Estado de Moneda', 'MONEDA_CAMBIAR_ESTADO', 'Activar o desactivar una moneda'),
    ('Eliminar Monedas',         'MONEDA_ELIMINAR',       'Eliminar una moneda del catálogo')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Monedas'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Enfermedades
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Enfermedades',              'ENFERMEDAD_VER',            'Consultar el catálogo de enfermedades'),
    ('Crear Enfermedades',            'ENFERMEDAD_CREAR',          'Registrar nuevas enfermedades'),
    ('Cambiar Estado de Enfermedad',  'ENFERMEDAD_CAMBIAR_ESTADO', 'Activar o desactivar una enfermedad'),
    ('Ver Catálogo de Enfermedades',  'ENFERMEDAD_CATALOGO_VER',   'Consultar el catálogo de enfermedades estándar'),
    ('Agregar Enfermedad con Catálogo','ENFERMEDAD_CATALOGO_CREAR', 'Agregar enfermedades usando el catálogo estándar')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Enfermedades'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Marcas
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Marcas',              'MARCA_VER',            'Consultar el catálogo de marcas'),
    ('Crear Marcas',            'MARCA_CREAR',          'Registrar nuevas marcas'),
    ('Editar Marcas',           'MARCA_EDITAR',         'Modificar datos de marcas existentes'),
    ('Cambiar Estado de Marca', 'MARCA_CAMBIAR_ESTADO', 'Activar o desactivar una marca')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Marcas'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Grupos de Productos
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Grupos',              'GRUPO_VER',            'Consultar los grupos de productos'),
    ('Crear Grupos',            'GRUPO_CREAR',          'Registrar nuevos grupos de productos'),
    ('Editar Grupos',           'GRUPO_EDITAR',         'Modificar grupos de productos existentes'),
    ('Cambiar Estado de Grupo', 'GRUPO_CAMBIAR_ESTADO', 'Activar o desactivar un grupo')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Grupos de Productos'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Lista de Precios
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Listas de Precios',           'LISTA_PRECIO_VER',            'Consultar las listas de precios'),
    ('Crear Lista de Precios',          'LISTA_PRECIO_CREAR',          'Registrar nuevas listas de precios'),
    ('Editar Lista de Precios',         'LISTA_PRECIO_EDITAR',         'Modificar listas de precios existentes'),
    ('Cambiar Estado de Lista de Precio','LISTA_PRECIO_CAMBIAR_ESTADO','Activar o desactivar una lista de precios')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Lista de Precios'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Tipo de Lente
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Tipos de Lente',              'TIPO_LENTE_VER',            'Consultar el catálogo de tipos de lente'),
    ('Crear Tipos de Lente',            'TIPO_LENTE_CREAR',          'Registrar nuevos tipos de lente'),
    ('Editar Tipos de Lente',           'TIPO_LENTE_EDITAR',         'Modificar tipos de lente existentes'),
    ('Cambiar Estado de Tipo de Lente', 'TIPO_LENTE_CAMBIAR_ESTADO', 'Activar o desactivar un tipo de lente')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Tipo de Lente'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Clasificación de Pacientes
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Clasificaciones',                    'CLASIFICACION_VER',            'Consultar el catálogo de clasificaciones de pacientes'),
    ('Crear Clasificaciones',                  'CLASIFICACION_CREAR',          'Registrar nuevas clasificaciones de pacientes'),
    ('Editar Clasificaciones',                 'CLASIFICACION_EDITAR',         'Modificar clasificaciones de pacientes existentes'),
    ('Cambiar Estado de Clasificación',        'CLASIFICACION_CAMBIAR_ESTADO', 'Activar o desactivar una clasificación de pacientes')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Clasificación de Pacientes'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Proveedores
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Proveedores',               'PROVEEDOR_VER',            'Consultar el listado de proveedores'),
    ('Crear Proveedores',             'PROVEEDOR_CREAR',          'Registrar nuevos proveedores'),
    ('Editar Proveedores',            'PROVEEDOR_EDITAR',         'Modificar datos de proveedores existentes'),
    ('Cambiar Estado de Proveedor',   'PROVEEDOR_CAMBIAR_ESTADO', 'Activar o desactivar un proveedor')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Proveedores'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Vendedores
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Vendedores',              'VENDEDOR_VER',            'Consultar el listado de vendedores'),
    ('Crear Vendedores',            'VENDEDOR_CREAR',          'Registrar nuevos vendedores'),
    ('Editar Vendedores',           'VENDEDOR_EDITAR',         'Modificar datos de vendedores existentes'),
    ('Cambiar Estado de Vendedor',  'VENDEDOR_CAMBIAR_ESTADO', 'Activar o desactivar un vendedor')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Vendedores'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Países (solo lectura, es catálogo)
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Países', 'PAIS_VER', 'Consultar el catálogo de países')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Países'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Usuarios
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Usuarios',             'USUARIO_VER',            'Consultar el listado de usuarios del sistema'),
    ('Crear Usuarios',           'USUARIO_CREAR',          'Registrar nuevos usuarios'),
    ('Editar Usuarios',          'USUARIO_EDITAR',         'Modificar datos de usuarios existentes'),
    ('Cambiar Estado de Usuario','USUARIO_CAMBIAR_ESTADO', 'Activar o desactivar un usuario')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Usuarios'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Roles y Permisos
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Roles',                  'ROL_VER',                  'Consultar el listado de roles del sistema'),
    ('Crear Roles',                'ROL_CREAR',                'Registrar nuevos roles'),
    ('Asignar Permisos a Rol',     'ROL_ASIGNAR_PERMISO',      'Agregar o quitar permisos en un rol'),
    ('Ver Roles de Usuario',       'USUARIO_ROL_VER',          'Consultar los roles asignados a un usuario'),
    ('Asignar Rol a Usuario',      'USUARIO_ROL_ASIGNAR',      'Asignar o remover roles de un usuario'),
    ('Ver Secciones',              'SECCION_VER',              'Consultar secciones del sistema'),
    ('Crear Secciones',            'SECCION_CREAR',            'Registrar nuevas secciones'),
    ('Ver Módulos',                'MODULO_VER',               'Consultar módulos del sistema'),
    ('Crear Módulos',              'MODULO_CREAR',             'Registrar nuevos módulos'),
    ('Ver Permisos',               'PERMISO_VER',              'Consultar permisos del sistema'),
    ('Crear Permisos',             'PERMISO_CREAR',            'Registrar nuevos permisos')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Roles y Permisos'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Configuración de Empresa
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Configuración de Empresa',   'EMPRESA_CONFIG_VER',   'Consultar la configuración de la empresa'),
    ('Editar Configuración de Empresa','EMPRESA_CONFIG_EDITAR','Modificar la configuración de la empresa')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Configuración de Empresa'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- Módulo: Sucursales
INSERT INTO [dbo].[Permiso] ([nombre], [codigo], [descripcion], [id_modulo], [activo])
SELECT v.[nombre], v.[codigo], v.[descripcion], m.[id_modulo], 1
FROM (VALUES
    ('Ver Sucursales',   'SUCURSAL_VER',   'Consultar el listado de sucursales'),
    ('Editar Sucursales','SUCURSAL_EDITAR','Modificar datos de sucursales existentes')
) AS v([nombre], [codigo], [descripcion])
INNER JOIN [dbo].[Modulo] m ON m.[nombre] = 'Sucursales'
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Permiso] p WHERE p.[codigo] = v.[codigo]
);

-- =============================================
-- 4. ROLES BASE
-- =============================================

INSERT INTO [dbo].[Rol] ([nombre], [descripcion], [activo])
SELECT v.[nombre], v.[descripcion], 1
FROM (VALUES
    ('Administrador',  'Acceso total al sistema. Puede gestionar usuarios, roles, configuración y todos los módulos.'),
    ('Optometrista',   'Acceso a pacientes, exámenes de la vista y enfermedades. Perfil clínico.'),
    ('Recepcionista',  'Registro y consulta de pacientes, apertura de caja y soporte en ventas.'),
    ('Vendedor',       'Acceso a facturación, cajas, movimientos de caja, productos y lista de precios.'),
    ('Inventarista',   'Gestión de productos, bodegas, grupos, marcas, proveedores y lista de precios.')
) AS v([nombre], [descripcion])
WHERE NOT EXISTS (
    SELECT 1 FROM [dbo].[Rol] r WHERE r.[nombre] = v.[nombre]
);

-- =============================================
-- 5. ASIGNACIÓN DE PERMISOS A ROLES
-- =============================================

-- ---- ROL: Administrador (todos los permisos) ----
INSERT INTO [dbo].[Rol_Permiso] ([id_rol], [id_permiso], [activo])
SELECT r.[id_rol], p.[id_permiso], 1
FROM [dbo].[Rol] r
CROSS JOIN [dbo].[Permiso] p
WHERE r.[nombre] = 'Administrador'
  AND NOT EXISTS (
    SELECT 1 FROM [dbo].[Rol_Permiso] rp
    WHERE rp.[id_rol] = r.[id_rol] AND rp.[id_permiso] = p.[id_permiso]
  );

-- ---- ROL: Optometrista ----
INSERT INTO [dbo].[Rol_Permiso] ([id_rol], [id_permiso], [activo])
SELECT r.[id_rol], p.[id_permiso], 1
FROM [dbo].[Rol] r
INNER JOIN [dbo].[Permiso] p ON p.[codigo] IN (
    'PACIENTE_VER', 'PACIENTE_CREAR', 'PACIENTE_EDITAR', 'PACIENTE_CAMBIAR_ESTADO',
    'PACIENTE_CLASIFICACION_VER', 'PACIENTE_CLASIFICACION_AGREGAR',
    'PACIENTE_CLASIFICACION_EDITAR', 'PACIENTE_CLASIFICACION_CAMBIAR_ESTADO',
    'EXAMEN_VER', 'EXAMEN_VER_DETALLE', 'EXAMEN_CREAR', 'EXAMEN_VER_GRADUACIONES',
    'ENFERMEDAD_VER', 'ENFERMEDAD_CATALOGO_VER',
    'TIPO_LENTE_VER',
    'CLASIFICACION_VER',
    'PAIS_VER'
)
WHERE r.[nombre] = 'Optometrista'
  AND NOT EXISTS (
    SELECT 1 FROM [dbo].[Rol_Permiso] rp
    WHERE rp.[id_rol] = r.[id_rol] AND rp.[id_permiso] = p.[id_permiso]
  );

-- ---- ROL: Recepcionista ----
INSERT INTO [dbo].[Rol_Permiso] ([id_rol], [id_permiso], [activo])
SELECT r.[id_rol], p.[id_permiso], 1
FROM [dbo].[Rol] r
INNER JOIN [dbo].[Permiso] p ON p.[codigo] IN (
    'PACIENTE_VER', 'PACIENTE_CREAR', 'PACIENTE_EDITAR',
    'PACIENTE_CLASIFICACION_VER', 'PACIENTE_CLASIFICACION_AGREGAR',
    'EXAMEN_VER',
    'CAJA_MOV_VER', 'CAJA_MOV_APERTURA',
    'CLASIFICACION_VER',
    'PAIS_VER'
)
WHERE r.[nombre] = 'Recepcionista'
  AND NOT EXISTS (
    SELECT 1 FROM [dbo].[Rol_Permiso] rp
    WHERE rp.[id_rol] = r.[id_rol] AND rp.[id_permiso] = p.[id_permiso]
  );

-- ---- ROL: Vendedor ----
INSERT INTO [dbo].[Rol_Permiso] ([id_rol], [id_permiso], [activo])
SELECT r.[id_rol], p.[id_permiso], 1
FROM [dbo].[Rol] r
INNER JOIN [dbo].[Permiso] p ON p.[codigo] IN (
    'PACIENTE_VER',
    'FACTURA_VER', 'FACTURA_CREAR',
    'CAJA_VER',
    'CAJA_MOV_VER', 'CAJA_MOV_CREAR', 'CAJA_MOV_APERTURA',
    'PRODUCTO_VER',
    'LISTA_PRECIO_VER',
    'PROVEEDOR_VER',
    'PAIS_VER'
)
WHERE r.[nombre] = 'Vendedor'
  AND NOT EXISTS (
    SELECT 1 FROM [dbo].[Rol_Permiso] rp
    WHERE rp.[id_rol] = r.[id_rol] AND rp.[id_permiso] = p.[id_permiso]
  );

-- ---- ROL: Inventarista ----
INSERT INTO [dbo].[Rol_Permiso] ([id_rol], [id_permiso], [activo])
SELECT r.[id_rol], p.[id_permiso], 1
FROM [dbo].[Rol] r
INNER JOIN [dbo].[Permiso] p ON p.[codigo] IN (
    'PRODUCTO_VER', 'PRODUCTO_CREAR', 'PRODUCTO_EDITAR', 'PRODUCTO_CAMBIAR_ESTADO',
    'BODEGA_VER', 'BODEGA_CREAR', 'BODEGA_EDITAR', 'BODEGA_CAMBIAR_ESTADO',
    'GRUPO_VER', 'GRUPO_CREAR', 'GRUPO_EDITAR', 'GRUPO_CAMBIAR_ESTADO',
    'MARCA_VER', 'MARCA_CREAR', 'MARCA_EDITAR', 'MARCA_CAMBIAR_ESTADO',
    'LISTA_PRECIO_VER', 'LISTA_PRECIO_CREAR', 'LISTA_PRECIO_EDITAR', 'LISTA_PRECIO_CAMBIAR_ESTADO',
    'PROVEEDOR_VER', 'PROVEEDOR_CREAR', 'PROVEEDOR_EDITAR', 'PROVEEDOR_CAMBIAR_ESTADO',
    'TIPO_LENTE_VER', 'TIPO_LENTE_CREAR', 'TIPO_LENTE_EDITAR', 'TIPO_LENTE_CAMBIAR_ESTADO',
    'MONEDA_VER',
    'PAIS_VER'
)
WHERE r.[nombre] = 'Inventarista'
  AND NOT EXISTS (
    SELECT 1 FROM [dbo].[Rol_Permiso] rp
    WHERE rp.[id_rol] = r.[id_rol] AND rp.[id_permiso] = p.[id_permiso]
  );

COMMIT TRANSACTION;
PRINT 'Seed de permisos ejecutado correctamente.';

END TRY
BEGIN CATCH
    ROLLBACK TRANSACTION;
    PRINT 'Error durante el seed de permisos:';
    PRINT ERROR_MESSAGE();
    THROW;
END CATCH;
GO

-- =============================================
-- VERIFICACIÓN RÁPIDA
-- =============================================
-- Descomentar para validar los datos insertados:

-- SELECT s.nombre AS Seccion, m.nombre AS Modulo, COUNT(p.id_permiso) AS TotalPermisos
-- FROM [dbo].[Seccion] s
-- INNER JOIN [dbo].[Modulo] m ON m.id_seccion = s.id_seccion
-- LEFT JOIN  [dbo].[Permiso] p ON p.id_modulo = m.id_modulo
-- GROUP BY s.nombre, m.nombre
-- ORDER BY s.nombre, m.nombre;

-- SELECT r.nombre AS Rol, COUNT(rp.id_permiso) AS TotalPermisos
-- FROM [dbo].[Rol] r
-- LEFT JOIN [dbo].[Rol_Permiso] rp ON rp.id_rol = r.id_rol
-- GROUP BY r.nombre
-- ORDER BY r.nombre;
