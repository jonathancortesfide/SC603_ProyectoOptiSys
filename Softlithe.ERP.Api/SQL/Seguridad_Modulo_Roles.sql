-- =============================================
-- MÓDULO DE SEGURIDAD: Secciones, Módulos, Permisos, Roles
-- =============================================

-- Sección: agrupa módulos (ej: Facturación, Inventario)
CREATE TABLE [dbo].[Seccion](
    [id_seccion]  [int] IDENTITY(1,1) NOT NULL,
    [nombre]      [varchar](100) NOT NULL,
    [activo]      [bit] NOT NULL CONSTRAINT [DF_Seccion_Activo] DEFAULT ((1)),
    CONSTRAINT [PK_Seccion] PRIMARY KEY CLUSTERED ([id_seccion] ASC)
);
GO

-- Módulo: pertenece a una sección (ej: Facturación Clientes, Facturación Mercadería)
CREATE TABLE [dbo].[Modulo](
    [id_modulo]   [int] IDENTITY(1,1) NOT NULL,
    [nombre]      [varchar](100) NOT NULL,
    [descripcion] [varchar](250) NULL,
    [id_seccion]  [int] NOT NULL,
    [activo]      [bit] NOT NULL CONSTRAINT [DF_Modulo_Activo] DEFAULT ((1)),
    CONSTRAINT [PK_Modulo] PRIMARY KEY CLUSTERED ([id_modulo] ASC),
    CONSTRAINT [FK_Modulo_Seccion] FOREIGN KEY ([id_seccion]) REFERENCES [dbo].[Seccion]([id_seccion])
);
GO

-- Permiso: pertenece a un módulo (ej: CREAR_FACTURA, ANULAR_FACTURA)
CREATE TABLE [dbo].[Permiso](
    [id_permiso]  [int] IDENTITY(1,1) NOT NULL,
    [nombre]      [varchar](100) NOT NULL,
    [codigo]      [varchar](100) NOT NULL,
    [descripcion] [varchar](250) NULL,
    [id_modulo]   [int] NOT NULL,
    [activo]      [bit] NOT NULL CONSTRAINT [DF_Permiso_Activo] DEFAULT ((1)),
    CONSTRAINT [PK_Permiso] PRIMARY KEY CLUSTERED ([id_permiso] ASC),
    CONSTRAINT [FK_Permiso_Modulo] FOREIGN KEY ([id_modulo]) REFERENCES [dbo].[Modulo]([id_modulo]),
    CONSTRAINT [UQ_Permiso_Codigo] UNIQUE ([codigo])
);
GO

-- Rol: agrupación lógica de permisos
CREATE TABLE [dbo].[Rol](
    [id_rol]      [int] IDENTITY(1,1) NOT NULL,
    [nombre]      [varchar](100) NOT NULL,
    [descripcion] [varchar](250) NULL,
    [activo]      [bit] NOT NULL CONSTRAINT [DF_Rol_Activo] DEFAULT ((1)),
    CONSTRAINT [PK_Rol] PRIMARY KEY CLUSTERED ([id_rol] ASC)
);
GO

-- Rol_Permiso: un rol puede tener varios permisos
CREATE TABLE [dbo].[Rol_Permiso](
    [id_rol_permiso] [int] IDENTITY(1,1) NOT NULL,
    [id_rol]         [int] NOT NULL,
    [id_permiso]     [int] NOT NULL,
    [activo]         [bit] NOT NULL CONSTRAINT [DF_Rol_Permiso_Activo] DEFAULT ((1)),
    CONSTRAINT [PK_Rol_Permiso] PRIMARY KEY CLUSTERED ([id_rol_permiso] ASC),
    CONSTRAINT [FK_Rol_Permiso_Rol]     FOREIGN KEY ([id_rol])     REFERENCES [dbo].[Rol]([id_rol]),
    CONSTRAINT [FK_Rol_Permiso_Permiso] FOREIGN KEY ([id_permiso]) REFERENCES [dbo].[Permiso]([id_permiso]),
    CONSTRAINT [UQ_Rol_Permiso] UNIQUE ([id_rol], [id_permiso])
);
GO

-- Usuario_Rol: un usuario puede tener varios roles
CREATE TABLE [dbo].[Usuario_Rol](
    [id_usuario_rol] [int] IDENTITY(1,1) NOT NULL,
    [id_usuario]     [int] NOT NULL,
    [id_rol]         [int] NOT NULL,
    [activo]         [bit] NOT NULL CONSTRAINT [DF_Usuario_Rol_Activo] DEFAULT ((1)),
    CONSTRAINT [PK_Usuario_Rol] PRIMARY KEY CLUSTERED ([id_usuario_rol] ASC),
    CONSTRAINT [FK_Usuario_Rol_Usuario] FOREIGN KEY ([id_usuario]) REFERENCES [dbo].[Usuario]([id_usuario]),
    CONSTRAINT [FK_Usuario_Rol_Rol]     FOREIGN KEY ([id_rol])     REFERENCES [dbo].[Rol]([id_rol]),
    CONSTRAINT [UQ_Usuario_Rol] UNIQUE ([id_usuario], [id_rol])
);
GO
