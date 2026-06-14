CREATE OR ALTER PROCEDURE [dbo].[sp_Paciente_ModificaEstado]
    @NoPaciente   INT,
    @Identificador INT,
    @EsActivo     BIT
AS
BEGIN
    SET NOCOUNT OFF;

    UPDATE [dbo].[Paciente]
    SET    [activo] = @EsActivo
    WHERE  [no_paciente]   = @NoPaciente
      AND  [identificador] = @Identificador;
END
GO
