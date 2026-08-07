USE [dbDesarrollo]
GO

SET NOCOUNT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    -- Catalog of identification types
    IF OBJECT_ID('[dbo].[TipoIdentificacion]', 'U') IS NULL
    BEGIN
        CREATE TABLE [dbo].[TipoIdentificacion](
            [id_tipo_identificacion] INT IDENTITY(1,1) NOT NULL,
            [codigo] VARCHAR(20) NOT NULL,
            [nombre] VARCHAR(100) NOT NULL,
            [activo] BIT NOT NULL CONSTRAINT [DF_TipoIdentificacion_Activo] DEFAULT ((1)),
            CONSTRAINT [PK_TipoIdentificacion] PRIMARY KEY CLUSTERED ([id_tipo_identificacion] ASC),
            CONSTRAINT [UQ_TipoIdentificacion_Codigo] UNIQUE ([codigo]),
            CONSTRAINT [UQ_TipoIdentificacion_Nombre] UNIQUE ([nombre])
        );
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[TipoIdentificacion] WHERE [codigo] = 'FISICA')
    BEGIN
        INSERT INTO [dbo].[TipoIdentificacion] ([codigo], [nombre], [activo])
        VALUES ('FISICA', 'Cédula Física', 1);
    END

    IF NOT EXISTS (SELECT 1 FROM [dbo].[TipoIdentificacion] WHERE [codigo] = 'JURIDICA')
    BEGIN
        INSERT INTO [dbo].[TipoIdentificacion] ([codigo], [nombre], [activo])
        VALUES ('JURIDICA', 'Cédula Jurídica', 1);
    END

    -- Add the FK column to Paciente if it does not exist yet
    IF COL_LENGTH('dbo.Paciente', 'id_tipo_identificacion') IS NULL
    BEGIN
        ALTER TABLE [dbo].[Paciente]
        ADD [id_tipo_identificacion] INT NULL;
    END

    -- Backfill from the existing text column if it still has values
    UPDATE p
    SET p.[id_tipo_identificacion] = t.[id_tipo_identificacion]
    FROM [dbo].[Paciente] p
    INNER JOIN [dbo].[TipoIdentificacion] t
        ON UPPER(LTRIM(RTRIM(ISNULL(p.[tipoidentificacion], '')))) IN (
            UPPER(t.[codigo]),
            UPPER(t.[nombre]),
            CASE WHEN t.[codigo] = 'FISICA' THEN '01' END,
            CASE WHEN t.[codigo] = 'JURIDICA' THEN '02' END
        );

    -- Add FK constraint only once
    IF NOT EXISTS (
        SELECT 1
        FROM sys.foreign_keys
        WHERE name = 'FK_Paciente_TipoIdentificacion'
    )
    BEGIN
        ALTER TABLE [dbo].[Paciente]
        ADD CONSTRAINT [FK_Paciente_TipoIdentificacion]
            FOREIGN KEY ([id_tipo_identificacion])
            REFERENCES [dbo].[TipoIdentificacion]([id_tipo_identificacion]);
    END

    -- Optional: keep the old text column for compatibility; if you want to remove it later,
    -- do it only after updating the API/repository to persist the FK instead of the string.

    COMMIT TRANSACTION;
    PRINT 'Catalogo de TipoIdentificacion creado/actualizado correctamente.';
END TRY
BEGIN CATCH
    IF @@TRANCOUNT > 0
        ROLLBACK TRANSACTION;

    THROW;
END CATCH;
GO

-- Patient query helpers: return the catalog id alongside the legacy text column.
CREATE OR ALTER PROCEDURE [dbo].[sp_Paciente_Obtener]
    @Identificador INT,
    @TextoBusqueda NVARCHAR(200) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        p.[no_paciente] AS NoPaciente,
        p.[identificador] AS Identificador,
        COALESCE(p.[id_tipo_identificacion], ti.[id_tipo_identificacion]) AS IdTipoIdentificacion,
        p.[tipoidentificacion] AS TipoIdentificacion,
        p.[cedula] AS Cedula,
        p.[nombre] AS Nombre,
        p.[direccion] AS Direccion,
        p.[fechanacimiento] AS FechaNacimiento,
        p.[email] AS Email,
        p.[email2] AS Email2,
        p.[telefono1] AS Telefono1,
        p.[telefono2] AS Telefono2,
        p.[sexo] AS Sexo,
        p.[plazo] AS Plazo,
        p.[limitecredito] AS LimiteCredito,
        p.[activo] AS Activo,
        p.[sinidentificacion] AS SinIdentificacion,
        p.[fecharegistro] AS FechaRegistro,
        p.[nombre_contacto_emergencia] AS NombreContactoEmergencia,
        p.[telefono_contacto_emergencia] AS TelefonoContactoEmergencia,
        p.[es_empadronado] AS EsEmpadronado,
        p.[codigo_actividad] AS CodigoActividad
    FROM [dbo].[Paciente] p
    LEFT JOIN [dbo].[TipoIdentificacion] ti
        ON ti.[id_tipo_identificacion] = p.[id_tipo_identificacion]
    WHERE p.[identificador] = @Identificador
      AND (
            @TextoBusqueda IS NULL
            OR @TextoBusqueda = ''
            OR p.[nombre] LIKE '%' + @TextoBusqueda + '%'
            OR p.[cedula] LIKE '%' + @TextoBusqueda + '%'
      )
    ORDER BY p.[nombre];
END
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_Paciente_ObtenerPorId]
    @NoPaciente INT
AS
BEGIN
    SET NOCOUNT ON;

    SELECT TOP 1
        p.[no_paciente] AS NoPaciente,
        p.[identificador] AS Identificador,
        COALESCE(p.[id_tipo_identificacion], ti.[id_tipo_identificacion]) AS IdTipoIdentificacion,
        p.[tipoidentificacion] AS TipoIdentificacion,
        p.[cedula] AS Cedula,
        p.[nombre] AS Nombre,
        p.[direccion] AS Direccion,
        p.[fechanacimiento] AS FechaNacimiento,
        p.[email] AS Email,
        p.[email2] AS Email2,
        p.[telefono1] AS Telefono1,
        p.[telefono2] AS Telefono2,
        p.[sexo] AS Sexo,
        p.[plazo] AS Plazo,
        p.[limitecredito] AS LimiteCredito,
        p.[activo] AS Activo,
        p.[sinidentificacion] AS SinIdentificacion,
        p.[fecharegistro] AS FechaRegistro,
        p.[nombre_contacto_emergencia] AS NombreContactoEmergencia,
        p.[telefono_contacto_emergencia] AS TelefonoContactoEmergencia,
        p.[es_empadronado] AS EsEmpadronado,
        p.[codigo_actividad] AS CodigoActividad
    FROM [dbo].[Paciente] p
    LEFT JOIN [dbo].[TipoIdentificacion] ti
        ON ti.[id_tipo_identificacion] = p.[id_tipo_identificacion]
    WHERE p.[no_paciente] = @NoPaciente;
END
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_Paciente_Insertar]
    @Identificador INT,
    @IdTipoIdentificacion INT = NULL,
    @TipoIdentificacion NVARCHAR(50) = NULL,
    @Cedula NVARCHAR(50),
    @Nombre NVARCHAR(200),
    @Direccion NVARCHAR(500) = NULL,
    @FechaNacimiento DATETIME = NULL,
    @Email NVARCHAR(200) = NULL,
    @Email2 NVARCHAR(200) = NULL,
    @Telefono1 NVARCHAR(50) = NULL,
    @Telefono2 NVARCHAR(50) = NULL,
    @Sexo NVARCHAR(10) = NULL,
    @Plazo INT = NULL,
    @LimiteCredito FLOAT = NULL,
    @Activo BIT = 1,
    @SinIdentificacion BIT = 0,
    @FechaRegistro DATETIME = NULL,
    @NombreContactoEmergencia NVARCHAR(200) = NULL,
    @TelefonoContactoEmergencia NVARCHAR(50) = NULL,
    @EsEmpadronado BIT = NULL,
    @CodigoActividad NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdTipoIdentificacionResolved INT = @IdTipoIdentificacion;

    IF @IdTipoIdentificacionResolved IS NULL AND @TipoIdentificacion IS NOT NULL
    BEGIN
        SELECT TOP 1 @IdTipoIdentificacionResolved = t.[id_tipo_identificacion]
        FROM [dbo].[TipoIdentificacion] t
        WHERE UPPER(t.[codigo]) = UPPER(LTRIM(RTRIM(@TipoIdentificacion)))
           OR UPPER(t.[nombre]) = UPPER(LTRIM(RTRIM(@TipoIdentificacion)));
    END

    INSERT INTO [dbo].[Paciente](
        [identificador],
        [id_tipo_identificacion],
        [tipoidentificacion],
        [cedula],
        [nombre],
        [direccion],
        [fechanacimiento],
        [email],
        [email2],
        [telefono1],
        [telefono2],
        [sexo],
        [plazo],
        [limitecredito],
        [activo],
        [sinidentificacion],
        [fecharegistro],
        [nombre_contacto_emergencia],
        [telefono_contacto_emergencia],
        [es_empadronado],
        [codigo_actividad]
    )
    SELECT
        @Identificador,
        @IdTipoIdentificacionResolved,
        ti.[codigo],
        @Cedula,
        @Nombre,
        @Direccion,
        @FechaNacimiento,
        @Email,
        @Email2,
        @Telefono1,
        @Telefono2,
        @Sexo,
        @Plazo,
        @LimiteCredito,
        @Activo,
        @SinIdentificacion,
        COALESCE(@FechaRegistro, GETDATE()),
        @NombreContactoEmergencia,
        @TelefonoContactoEmergencia,
        @EsEmpadronado,
        @CodigoActividad
    FROM (SELECT 1 AS Dummy) x
    LEFT JOIN [dbo].[TipoIdentificacion] ti
        ON ti.[id_tipo_identificacion] = @IdTipoIdentificacionResolved;
END
GO

CREATE OR ALTER PROCEDURE [dbo].[sp_Paciente_Actualizar]
    @NoPaciente INT,
    @Identificador INT,
    @IdTipoIdentificacion INT = NULL,
    @TipoIdentificacion NVARCHAR(50) = NULL,
    @Cedula NVARCHAR(50),
    @Nombre NVARCHAR(200),
    @Direccion NVARCHAR(500) = NULL,
    @FechaNacimiento DATETIME = NULL,
    @Email NVARCHAR(200) = NULL,
    @Email2 NVARCHAR(200) = NULL,
    @Telefono1 NVARCHAR(50) = NULL,
    @Telefono2 NVARCHAR(50) = NULL,
    @Sexo NVARCHAR(10) = NULL,
    @Plazo INT = NULL,
    @LimiteCredito FLOAT = NULL,
    @SinIdentificacion BIT = 0,
    @NombreContactoEmergencia NVARCHAR(200) = NULL,
    @TelefonoContactoEmergencia NVARCHAR(50) = NULL,
    @EsEmpadronado BIT = NULL,
    @CodigoActividad NVARCHAR(50) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @IdTipoIdentificacionResolved INT = @IdTipoIdentificacion;

    IF @IdTipoIdentificacionResolved IS NULL AND @TipoIdentificacion IS NOT NULL
    BEGIN
        SELECT TOP 1 @IdTipoIdentificacionResolved = t.[id_tipo_identificacion]
        FROM [dbo].[TipoIdentificacion] t
        WHERE UPPER(t.[codigo]) = UPPER(LTRIM(RTRIM(@TipoIdentificacion)))
           OR UPPER(t.[nombre]) = UPPER(LTRIM(RTRIM(@TipoIdentificacion)));
    END

    UPDATE [dbo].[Paciente]
    SET [identificador] = @Identificador,
        [id_tipo_identificacion] = @IdTipoIdentificacionResolved,
        [tipoidentificacion] = ti.[codigo],
        [cedula] = @Cedula,
        [nombre] = @Nombre,
        [direccion] = @Direccion,
        [fechanacimiento] = @FechaNacimiento,
        [email] = @Email,
        [email2] = @Email2,
        [telefono1] = @Telefono1,
        [telefono2] = @Telefono2,
        [sexo] = @Sexo,
        [plazo] = @Plazo,
        [limitecredito] = @LimiteCredito,
        [sinidentificacion] = @SinIdentificacion,
        [nombre_contacto_emergencia] = @NombreContactoEmergencia,
        [telefono_contacto_emergencia] = @TelefonoContactoEmergencia,
        [es_empadronado] = @EsEmpadronado,
        [codigo_actividad] = @CodigoActividad
    FROM [dbo].[Paciente] p
    LEFT JOIN [dbo].[TipoIdentificacion] ti
        ON ti.[id_tipo_identificacion] = @IdTipoIdentificacionResolved
    WHERE p.[no_paciente] = @NoPaciente
      AND p.[identificador] = @Identificador;
END
GO