USE [dbDesarrollo]
GO

/****** Object:  StoredProcedure [dbo].[ObtenerExamenGraduaciones]    Script Date: 6/15/2026 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Examenes Module
-- Create date: 6/15/2026
-- Description:	Retrieves exam data and graduation data for a patient
-- =============================================
CREATE PROCEDURE [dbo].[ObtenerExamenGraduaciones]
	@no_paciente INT
AS
BEGIN
	SET NOCOUNT ON;

	BEGIN TRY
		-- Return exam data for the patient
		SELECT 
			e.id_examen,
			e.no_examen,
			e.no_paciente,
			e.fecha_examen,
			e.motivo,
			e.no_estado_examen
		FROM [dbo].[Examen] e
		WHERE e.no_paciente = @no_paciente
		ORDER BY e.fecha_examen DESC;

		-- Return graduation data (can be empty or related data)
		SELECT 
			eg.id_graduacion,
			CAST(eg.id_examen AS VARCHAR(50)) as abreviatura,
			CAST(0 AS DECIMAL(18,2)) as resultado_valor,
			'' as posicion,
			'' as posicion_nombre
		FROM [dbo].[ExamenGraduacion] eg
		WHERE eg.id_examen IN (SELECT id_examen FROM [dbo].[Examen] WHERE no_paciente = @no_paciente)
		ORDER BY eg.id_examen DESC;

	END TRY
	BEGIN CATCH
		DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
		DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
		DECLARE @ErrorState INT = ERROR_STATE();

		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);
	END CATCH

	SET NOCOUNT OFF;
END
GO
