-- =============================================
-- LIMPIEZA DE PERMISOS OBSOLETOS
-- =============================================
-- Objetivo: desactivar permisos que ya no se usan en el alcance actual del sistema.
-- No elimina físicamente registros ni rompe dependencias; solo desactiva permisos y sus asignaciones.
-- Ejecutar en SQL Server contra la base de datos del ERP.
-- =============================================

SET NOCOUNT ON;

DECLARE @PermisosObsoletos TABLE (codigo varchar(100));

INSERT INTO @PermisosObsoletos (codigo)
VALUES
    ('BODEGA_VER'),
    ('BODEGA_CREAR'),
    ('BODEGA_EDITAR'),
    ('BODEGA_CAMBIAR_ESTADO'),
    ('CAJA_VER'),
    ('CAJA_CREAR'),
    ('CAJA_EDITAR'),
    ('CAJA_CAMBIAR_ESTADO'),
    ('CAJA_MOV_VER'),
    ('CAJA_MOV_CREAR'),
    ('CAJA_MOV_APERTURA'),
    ('VENDEDOR_VER'),
    ('VENDEDOR_CREAR'),
    ('VENDEDOR_EDITAR'),
    ('VENDEDOR_CAMBIAR_ESTADO'),
    ('GRUPO_VER'),
    ('GRUPO_CREAR'),
    ('GRUPO_EDITAR'),
    ('GRUPO_CAMBIAR_ESTADO'),
    ('ROL_VER'),
    ('ROL_CREAR'),
    ('ROL_ASIGNAR_PERMISO'),
    ('SECCION_VER'),
    ('SECCION_CREAR'),
    ('MODULO_VER'),
    ('MODULO_CREAR'),
    ('PERMISO_VER'),
    ('PERMISO_CREAR'),
    ('EMPRESA_CONFIG_VER'),
    ('EMPRESA_CONFIG_EDITAR'),
    ('SUCURSAL_VER'),
    ('SUCURSAL_EDITAR'),
    ('ENFERMEDAD_CATALOGO_VER'),
    ('ENFERMEDAD_CATALOGO_CREAR'),
    ('CLASIFICACION_VER'),
    ('CLASIFICACION_CREAR'),
    ('CLASIFICACION_EDITAR'),
    ('CLASIFICACION_CAMBIAR_ESTADO'),
    ('PAIS_VER');

-- 1) Desactivar permisos obsoletos
UPDATE p
SET p.activo = 0
FROM dbo.Permiso p
INNER JOIN @PermisosObsoletos o ON o.codigo = p.codigo;

-- 2) Desactivar asignaciones de esos permisos a roles
UPDATE rp
SET rp.activo = 0
FROM dbo.Rol_Permiso rp
INNER JOIN dbo.Permiso p ON p.id_permiso = rp.id_permiso
INNER JOIN @PermisosObsoletos o ON o.codigo = p.codigo;

-- 3) Mostrar qué registros quedaron afectados
SELECT p.codigo, p.nombre, p.activo
FROM dbo.Permiso p
INNER JOIN @PermisosObsoletos o ON o.codigo = p.codigo
ORDER BY p.codigo;
