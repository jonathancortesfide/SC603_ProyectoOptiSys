CREATE DATABASE LensysLocal;
GO

USE LensysLocal;
GO

-- =============================================================
-- LENSYS - Full Schema
-- Modules: Mantenimientos, Pacientes, Productos, Seguridad
-- Dialect: SQL Server (T-SQL)
-- Pacientes simplified to basic information only
-- =============================================================

-- ========================
-- LOOKUP / CATALOGUE TABLES
-- (Mantenimientos module)
-- ========================

CREATE TABLE Moneda (
    no_moneda      INT PRIMARY KEY IDENTITY(1,1),
    codigo_iso     VARCHAR(3)      NOT NULL UNIQUE,
    descripcion    NVARCHAR(100)   NOT NULL,
    signo          VARCHAR(5)      NOT NULL,
    url            NVARCHAR(255)   NULL,
    es_nacional    BIT             NOT NULL DEFAULT 0,
    activo         BIT             NOT NULL DEFAULT 1,
    fecha_creacion DATETIME        NOT NULL DEFAULT GETDATE(),
    fecha_modificacion DATETIME    NULL
);
GO

CREATE TABLE MonedaSucursal (
    id_moneda      INT PRIMARY KEY IDENTITY(1,1),
    identificador  INT NOT NULL,
    no_moneda      INT NOT NULL,
    activo         BIT NOT NULL DEFAULT 1,
    CONSTRAINT FK_MonedaSucursal_Moneda FOREIGN KEY (no_moneda) REFERENCES Moneda(no_moneda)
);
GO

CREATE TABLE GrupoProductos (
    no_grupo            INT             PRIMARY KEY IDENTITY(1,1),
    no_empresa          INT             NOT NULL,
    descripcion         NVARCHAR(150)   NOT NULL,
    activo              BIT             NOT NULL DEFAULT 1,
    fecha_creacion      DATETIME        NOT NULL DEFAULT GETDATE(),
    fecha_modificacion  DATETIME        NULL
);
GO

CREATE TABLE TipoLente (
    no_tipo             INT             PRIMARY KEY IDENTITY(1,1),
    no_empresa          INT             NOT NULL,
    descripcion         NVARCHAR(100)   NOT NULL,
    activo              BIT             NOT NULL DEFAULT 1,
    fecha_creacion      DATETIME        NOT NULL DEFAULT GETDATE(),
    fecha_modificacion  DATETIME        NULL
);
GO

CREATE TABLE ClasificacionPaciente (
    no_clasificacion    INT             PRIMARY KEY IDENTITY(1,1),
    no_empresa          INT             NOT NULL,
    descripcion         NVARCHAR(150)   NOT NULL,
    porcentaje_descuento DECIMAL(5,2)   NOT NULL DEFAULT 0,
    activo              BIT             NOT NULL DEFAULT 1,
    fecha_creacion      DATETIME        NOT NULL DEFAULT GETDATE(),
    fecha_modificacion  DATETIME        NULL
);
GO

CREATE TABLE Marca (
    no_marca            INT             PRIMARY KEY IDENTITY(1,1),
    no_empresa          INT             NOT NULL,
    descripcion         NVARCHAR(100)   NOT NULL,
    activo              BIT             NOT NULL DEFAULT 1,
    fecha_creacion      DATETIME        NOT NULL DEFAULT GETDATE(),
    fecha_modificacion  DATETIME        NULL
);
GO

CREATE TABLE ListaPrecio (
    no_lista            INT             PRIMARY KEY IDENTITY(1,1),
    no_empresa          INT             NOT NULL,
    descripcion         NVARCHAR(150)   NOT NULL,
    moneda_no_moneda    INT             NOT NULL,
    vigencia_desde      DATE            NOT NULL,
    vigencia_hasta      DATE            NULL,
    activo              BIT             NOT NULL DEFAULT 1,
    fecha_creacion      DATETIME        NOT NULL DEFAULT GETDATE(),
    fecha_modificacion  DATETIME        NULL,
    CONSTRAINT FK_ListaPrecio_Moneda FOREIGN KEY (moneda_no_moneda)
        REFERENCES Moneda(no_moneda)
);
GO

-- ========================
-- LOOKUP: Pais
-- ========================

CREATE TABLE Pais (
    no_pais             INT             PRIMARY KEY IDENTITY(1,1),
    codigo_iso          VARCHAR(3)      NOT NULL UNIQUE,
    nombre              NVARCHAR(100)   NOT NULL,
    activo              BIT             NOT NULL DEFAULT 1
);
GO

-- ========================
-- MODULE: PACIENTES
-- Simplified to basic information only
-- ========================

CREATE TABLE Paciente (
    no_paciente                     INT             PRIMARY KEY IDENTITY(1,1),
    no_empresa                      INT             NOT NULL,
    tipo_identificacion             VARCHAR(20)     NOT NULL
                                        CONSTRAINT CHK_Paciente_TipoId
                                        CHECK (tipo_identificacion IN ('fisica','juridica','dimex','nite','pasaporte')),
    identificacion                  VARCHAR(50)     NOT NULL,
    nombre                          NVARCHAR(255)   NOT NULL,
    fecha_nacimiento                DATE            NULL,
    sexo                            CHAR(1)         NULL
                                        CONSTRAINT CHK_Paciente_Sexo
                                        CHECK (sexo IN ('M','F','O')),
    no_pais_nacionalidad            INT             NULL,
    telefono1                       VARCHAR(30)     NULL,
    telefono2                       VARCHAR(30)     NULL,
    email1                          VARCHAR(150)    NULL,
    direccion                       NVARCHAR(500)   NULL,
    no_envia_factura_electronica    BIT             NOT NULL DEFAULT 0,
    contacto_emergencia_nombre      NVARCHAR(255)   NULL,
    contacto_emergencia_telefono    VARCHAR(30)     NULL,
    es_activo                       BIT             NOT NULL DEFAULT 1,
    fecha_creacion                  DATETIME        NOT NULL DEFAULT GETDATE(),
    fecha_modificacion              DATETIME        NULL,

    CONSTRAINT UQ_Paciente_Empresa_Identificacion UNIQUE (no_empresa, identificacion),
    CONSTRAINT FK_Paciente_Pais FOREIGN KEY (no_pais_nacionalidad) REFERENCES Pais(no_pais)
);
GO

-- ========================
-- MODULE: PRODUCTOS
-- ========================

CREATE TABLE Producto (
    no_producto                 INT             PRIMARY KEY IDENTITY(1,1),
    no_empresa                  INT             NOT NULL,
    tipo_articulo               VARCHAR(20)     NOT NULL
                                    CONSTRAINT CHK_Producto_TipoArticulo
                                    CHECK (tipo_articulo IN ('Material','Servicio','Servicio-Externo')),
    codigo_interno              VARCHAR(50)     NOT NULL,
    codigo_barras               VARCHAR(50)     NULL,
    codigo_auxiliar             VARCHAR(50)     NULL,
    nombre                      NVARCHAR(255)   NOT NULL,
    codigo_cabys                VARCHAR(20)     NULL,
    unidad_medida               VARCHAR(30)     NULL,
    no_grupo                    INT             NULL,
    no_marca                    INT             NULL,
    no_tipo_lente               INT             NULL,
    tipo_impuesto               VARCHAR(10)     NOT NULL
                                    CONSTRAINT CHK_Producto_TipoImpuesto
                                    CHECK (tipo_impuesto IN ('Exento','IVA','Otro')),
    porcentaje_impuesto         DECIMAL(6,2)    NOT NULL DEFAULT 0,
    existencia                  DECIMAL(14,4)   NOT NULL DEFAULT 0,
    minimo                      DECIMAL(14,4)   NOT NULL DEFAULT 0,
    es_perecedero               BIT             NOT NULL DEFAULT 0,
    costo_promedio_ponderado    DECIMAL(18,4)   NOT NULL DEFAULT 0,
    costo_ultima_compra         DECIMAL(18,4)   NOT NULL DEFAULT 0,
    costo_final                 DECIMAL(18,4)   NOT NULL DEFAULT 0,
    caracteristicas             NVARCHAR(MAX)   NULL,
    foto                        NVARCHAR(MAX)   NULL,
    activo                      BIT             NOT NULL DEFAULT 1,
    fecha_creacion              DATETIME        NOT NULL DEFAULT GETDATE(),
    fecha_modificacion          DATETIME        NULL,

    CONSTRAINT UQ_Producto_Empresa_Codigo UNIQUE (no_empresa, codigo_interno),
    CONSTRAINT FK_Producto_Grupo FOREIGN KEY (no_grupo) REFERENCES GrupoProductos(no_grupo),
    CONSTRAINT FK_Producto_Marca FOREIGN KEY (no_marca) REFERENCES Marca(no_marca),
    CONSTRAINT FK_Producto_TipoLente FOREIGN KEY (no_tipo_lente) REFERENCES TipoLente(no_tipo)
);
GO

CREATE TABLE ProductoListaPrecio (
    no_producto_lista   INT             PRIMARY KEY IDENTITY(1,1),
    no_producto         INT             NOT NULL,
    no_lista            INT             NOT NULL,
    utilidad            DECIMAL(6,2)    NOT NULL DEFAULT 0,
    precio_neto         DECIMAL(18,4)   NOT NULL DEFAULT 0,
    precio_cliente      DECIMAL(18,4)   NOT NULL DEFAULT 0,
    fecha_creacion      DATETIME        NOT NULL DEFAULT GETDATE(),
    fecha_modificacion  DATETIME        NULL,

    CONSTRAINT UQ_ProductoListaPrecio UNIQUE (no_producto, no_lista),
    CONSTRAINT FK_PLP_Producto FOREIGN KEY (no_producto) REFERENCES Producto(no_producto) ON DELETE CASCADE,
    CONSTRAINT FK_PLP_Lista FOREIGN KEY (no_lista) REFERENCES ListaPrecio(no_lista)
);
GO

-- ========================
-- MODULE: SEGURIDAD
-- ========================

CREATE TABLE ModuloSistema (
    no_modulo           INT             PRIMARY KEY IDENTITY(1,1),
    nombre              NVARCHAR(100)   NOT NULL UNIQUE,
    descripcion         NVARCHAR(255)   NULL,
    activo              BIT             NOT NULL DEFAULT 1
);
GO

CREATE TABLE Permiso (
    no_permiso          INT             PRIMARY KEY IDENTITY(1,1),
    no_modulo           INT             NOT NULL,
    nombre              NVARCHAR(100)   NOT NULL,
    descripcion         NVARCHAR(255)   NULL,
    accion              VARCHAR(10)     NOT NULL
                            CONSTRAINT CHK_Permiso_Accion
                            CHECK (accion IN ('read','create','update','delete')),
    activo              BIT             NOT NULL DEFAULT 1,

    CONSTRAINT UQ_Permiso_Modulo_Accion UNIQUE (no_modulo, accion),
    CONSTRAINT FK_Permiso_Modulo FOREIGN KEY (no_modulo) REFERENCES ModuloSistema(no_modulo)
);
GO

CREATE TABLE Rol (
    no_rol              INT             PRIMARY KEY IDENTITY(1,1),
    no_empresa          INT             NOT NULL,
    nombre              NVARCHAR(100)   NOT NULL,
    descripcion         NVARCHAR(255)   NULL,
    activo              BIT             NOT NULL DEFAULT 1,
    fecha_creacion      DATETIME        NOT NULL DEFAULT GETDATE(),
    fecha_modificacion  DATETIME        NULL,

    CONSTRAINT UQ_Rol_Empresa_Nombre UNIQUE (no_empresa, nombre)
);
GO

CREATE TABLE RolPermiso (
    no_rol              INT             NOT NULL,
    no_permiso          INT             NOT NULL,
    PRIMARY KEY (no_rol, no_permiso),

    CONSTRAINT FK_RolPermiso_Rol FOREIGN KEY (no_rol) REFERENCES Rol(no_rol) ON DELETE CASCADE,
    CONSTRAINT FK_RolPermiso_Permiso FOREIGN KEY (no_permiso) REFERENCES Permiso(no_permiso) ON DELETE CASCADE
);
GO

CREATE TABLE Usuario (
    no_usuario          INT             PRIMARY KEY IDENTITY(1,1),
    no_empresa          INT             NOT NULL,
    login               VARCHAR(50)     NOT NULL,
    email               VARCHAR(150)    NOT NULL,
    contrasena_hash     VARCHAR(255)    NOT NULL,
    nombre              NVARCHAR(255)   NOT NULL,
    es_doctor           BIT             NOT NULL DEFAULT 0,
    codigo_profesional  VARCHAR(50)     NULL,
    telefono            VARCHAR(30)     NULL,
    direccion           NVARCHAR(500)   NULL,
    fecha_nacimiento    DATE            NULL,
    activo              BIT             NOT NULL DEFAULT 1,
    fecha_creacion      DATETIME        NOT NULL DEFAULT GETDATE(),
    fecha_modificacion  DATETIME        NULL,

    CONSTRAINT UQ_Usuario_Empresa_Login UNIQUE (no_empresa, login),
    CONSTRAINT UQ_Usuario_Empresa_Email UNIQUE (no_empresa, email),
    CONSTRAINT CHK_Usuario_Doctor CHECK (es_doctor = 0 OR codigo_profesional IS NOT NULL)
);
GO

CREATE TABLE UsuarioRol (
    no_usuario          INT             NOT NULL,
    no_rol              INT             NOT NULL,
    fecha_asignacion    DATETIME        NOT NULL DEFAULT GETDATE(),
    PRIMARY KEY (no_usuario, no_rol),

    CONSTRAINT FK_UsuarioRol_Usuario FOREIGN KEY (no_usuario) REFERENCES Usuario(no_usuario) ON DELETE CASCADE,
    CONSTRAINT FK_UsuarioRol_Rol FOREIGN KEY (no_rol) REFERENCES Rol(no_rol) ON DELETE CASCADE
);
GO

CREATE TABLE UsuarioHistorialContrasena (
    no_historial        INT             PRIMARY KEY IDENTITY(1,1),
    no_usuario          INT             NOT NULL,
    contrasena_hash     VARCHAR(255)    NOT NULL,
    fecha_cambio        DATETIME        NOT NULL DEFAULT GETDATE(),

    CONSTRAINT FK_HistContrasena_Usuario FOREIGN KEY (no_usuario) REFERENCES Usuario(no_usuario) ON DELETE CASCADE
);
GO

-- =========================
-- INDEXES
-- =========================

CREATE INDEX IX_GrupoProductos_Empresa_Activo       ON GrupoProductos       (no_empresa, activo);
CREATE INDEX IX_TipoLente_Empresa_Activo            ON TipoLente            (no_empresa, activo);
CREATE INDEX IX_ClasificacionPaciente_Empresa_Activo ON ClasificacionPaciente (no_empresa, activo);
CREATE INDEX IX_Marca_Empresa_Activo                ON Marca                (no_empresa, activo);
CREATE INDEX IX_ListaPrecio_Empresa_Activo          ON ListaPrecio          (no_empresa, activo);
CREATE INDEX IX_ListaPrecio_Moneda                  ON ListaPrecio          (moneda_no_moneda);

CREATE INDEX IX_Paciente_Empresa_Identificacion     ON Paciente (no_empresa, identificacion);
CREATE INDEX IX_Paciente_Empresa_Nombre             ON Paciente (no_empresa, nombre);
CREATE INDEX IX_Producto_Empresa_CodigoInterno      ON Producto (no_empresa, codigo_interno);
CREATE INDEX IX_Producto_Empresa_CodigoBarras       ON Producto (no_empresa, codigo_barras);
CREATE INDEX IX_ProductoListaPrecio_Lista           ON ProductoListaPrecio (no_lista);
CREATE INDEX IX_Usuario_Empresa_Login               ON Usuario (no_empresa, login);
CREATE INDEX IX_Permiso_Modulo                      ON Permiso (no_modulo);
CREATE INDEX IX_Rol_Empresa                         ON Rol (no_empresa);
GO
