SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

/*
    Seed de pacientes adultos (Costa Rica)
    1) Elimina datos de prueba (Prueba A, Prueba Dos, etc.)
    2) Inserta pacientes adultos creibles evitando duplicados por (identificador, cedula)
*/

DECLARE @Identificador INT = 1;
DECLARE @TipoIdentificacion CHAR(2) = 'FI';

DELETE p
FROM dbo.Paciente p
WHERE p.identificador = @Identificador
  AND (
      UPPER(LTRIM(RTRIM(ISNULL(p.nombre, '')))) LIKE 'PRUEBA%'
      OR p.cedula IN ('999000130', '999000131', '1211121213123123123123')
  );

DECLARE @Pacientes TABLE (
    Cedula VARCHAR(20) NOT NULL,
    Nombre NVARCHAR(120) NOT NULL,
    Direccion NVARCHAR(200) NULL,
    FechaNacimiento DATE NOT NULL,
    Email VARCHAR(120) NULL,
    Telefono1 VARCHAR(20) NULL,
    Sexo CHAR(1) NULL,
    NombreContactoEmergencia NVARCHAR(120) NULL,
    TelefonoContactoEmergencia VARCHAR(20) NULL
);

INSERT INTO @Pacientes (
    Cedula,
    Nombre,
    Direccion,
    FechaNacimiento,
    Email,
    Telefono1,
    Sexo,
    NombreContactoEmergencia,
    TelefonoContactoEmergencia
)
VALUES
('104560789', 'Carlos Andres Solano Arce', 'San Jose, Desamparados, San Rafael Arriba', '1988-03-12', 'carlos.solano88@gmail.com', '87014523', 'M', 'Laura Arce Mora', '86651234'),
('206780912', 'Mariana Rodriguez Ulate', 'Alajuela, Grecia, San Isidro', '1992-11-07', 'mariana.r.ulate92@gmail.com', '83894567', 'F', 'Jose Rodriguez Vargas', '88217654'),
('303450678', 'Daniela Chacon Quesada', 'Cartago, El Guarco, Tejar', '1985-06-21', 'daniela.chacon85@gmail.com', '87129834', 'F', 'Ricardo Quesada Chacon', '87994512'),
('402340567', 'Jorge Alberto Vindas Mena', 'Heredia, Santo Domingo, Santa Rosa', '1979-01-30', 'jorge.vindas79@gmail.com', '86233411', 'M', 'Paola Mena Villalobos', '85679002'),
('503980456', 'Lucia Fernandez Calderon', 'Puntarenas, Esparza, San Jeronimo', '1990-09-15', 'lucia.fernandez90@gmail.com', '87763120', 'F', 'Miguel Fernandez Solis', '88890444'),
('604120345', 'Esteban Morales Cordero', 'Limon, Guapiles, Pococi Centro', '1983-12-02', 'esteban.morales83@gmail.com', '84556789', 'M', 'Sofia Cordero Mora', '85223710'),
('108670234', 'Andrea Maria Zamora Brenes', 'San Jose, Goicoechea, Guadalupe', '1995-04-18', 'andrea.zamora95@gmail.com', '87115566', 'F', 'Gabriel Zamora Salas', '87004322'),
('207540123', 'Ricardo Jimenez Paniagua', 'Alajuela, San Ramon, Santiago', '1981-08-09', 'ricardo.jimenez81@gmail.com', '85617834', 'M', 'Natalia Paniagua Lopez', '84321990'),
('305430912', 'Paola Herrera Montero', 'Cartago, Turrialba, Santa Cruz', '1989-02-25', 'paola.herrera89@gmail.com', '84456770', 'F', 'Luis Montero Herrera', '85788931'),
('406520801', 'Mauricio Nunez Villalobos', 'Heredia, Belen, La Ribera', '1977-07-03', 'mauricio.nunez77@gmail.com', '86801234', 'M', 'Elena Villalobos Nunez', '87890011');

DECLARE
    @Cedula VARCHAR(20),
    @Nombre NVARCHAR(120),
    @Direccion NVARCHAR(200),
    @FechaNacimiento DATE,
    @Email VARCHAR(120),
    @Telefono1 VARCHAR(20),
    @Sexo CHAR(1),
    @NombreContactoEmergencia NVARCHAR(120),
    @TelefonoContactoEmergencia VARCHAR(20),
    @FechaRegistro DATETIME = GETDATE();

DECLARE cSeed CURSOR LOCAL FAST_FORWARD FOR
SELECT
    Cedula,
    Nombre,
    Direccion,
    FechaNacimiento,
    Email,
    Telefono1,
    Sexo,
    NombreContactoEmergencia,
    TelefonoContactoEmergencia
FROM @Pacientes;

OPEN cSeed;
FETCH NEXT FROM cSeed INTO
    @Cedula,
    @Nombre,
    @Direccion,
    @FechaNacimiento,
    @Email,
    @Telefono1,
    @Sexo,
    @NombreContactoEmergencia,
    @TelefonoContactoEmergencia;

WHILE @@FETCH_STATUS = 0
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM dbo.Paciente
        WHERE identificador = @Identificador
          AND cedula = @Cedula
    )
    BEGIN
        EXEC dbo.sp_Paciente_Insertar
            @Identificador = @Identificador,
            @TipoIdentificacion = @TipoIdentificacion,
            @Cedula = @Cedula,
            @Nombre = @Nombre,
            @Direccion = @Direccion,
            @FechaNacimiento = @FechaNacimiento,
            @Email = @Email,
            @Telefono1 = @Telefono1,
            @Sexo = @Sexo,
            @Activo = 1,
            @SinIdentificacion = 0,
            @FechaRegistro = @FechaRegistro,
            @NombreContactoEmergencia = @NombreContactoEmergencia,
            @TelefonoContactoEmergencia = @TelefonoContactoEmergencia;
    END;

    FETCH NEXT FROM cSeed INTO
        @Cedula,
        @Nombre,
        @Direccion,
        @FechaNacimiento,
        @Email,
        @Telefono1,
        @Sexo,
        @NombreContactoEmergencia,
        @TelefonoContactoEmergencia;
END;

CLOSE cSeed;
DEALLOCATE cSeed;

SELECT
    no_paciente,
    identificador,
    cedula,
    nombre,
    fechanacimiento,
    telefono1,
    email
FROM dbo.Paciente
WHERE identificador = @Identificador
  AND cedula IN (
      SELECT Cedula
      FROM @Pacientes
  )
ORDER BY no_paciente DESC;
