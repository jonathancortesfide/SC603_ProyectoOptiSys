USE [dbDesarrollo]
GO

/****** Object:  StoredProcedure [dbo].[paDMLExamen]    Script Date: 6/15/2026 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

-- =============================================
-- Author:		Examenes Module
-- Create date: 6/15/2026
-- Description:	DML Stored Procedure for Exam Management
--              Handles INSERT/UPDATE operations for exams with support for
--              XML data for Patologias, Graduaciones, and Disenos
-- =============================================
CREATE PROCEDURE [dbo].[paDMLExamen]
	@pno_examen INT,
	@pno_paciente INT,
	@pfecha_examen DATETIME,
	@pmotivo NVARCHAR(700),
	@ptipo_examen NVARCHAR(255),
	@pdp_general NVARCHAR(255),
	@pMedio_transp NVARCHAR(255),
	@pfo NVARCHAR(255),
	@ppio NVARCHAR(255),
	@pno_empresa INT,
	@pestado NVARCHAR(255),
	@pultimo_examen DATETIME,
	@ptratamiento_anterior NVARCHAR(MAX),
	@pmodo_uso NVARCHAR(255),
	@ptipo_patologias NVARCHAR(MAX),
	@ptiene_diseno NVARCHAR(50),
	@ptiene_aro NVARCHAR(50),
	@pdiagonal DECIMAL(10, 2),
	@pTipoDML NVARCHAR(1),
	@pvertical DECIMAL(10, 2),
	@ppuente DECIMAL(10, 2),
	@phorizontal DECIMAL(10, 2),
	@pxmlPatologias NVARCHAR(MAX),
	@pxmlGraduaciones NVARCHAR(MAX),
	@pxmlDisenos NVARCHAR(MAX),
	@pcodigoAro NVARCHAR(255),
	@pimagen VARBINARY(MAX),
	@pcodigoExamen NVARCHAR(255),
	@pno_proveedor_laboratorio INT,
	@pno_orden_laboratorio NVARCHAR(255),
	@pno_pedido_laboratorio NVARCHAR(255),
	@pcodigo_lentecontacto NVARCHAR(255)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @id_examen INT;
	DECLARE @no_estado_examen SMALLINT;

	BEGIN TRY
		BEGIN TRANSACTION;

		-- Determine the operation type (Insert or Update)
		IF @pTipoDML = 'I' OR @pTipoDML = 'i'
		BEGIN
			-- INSERT operation
			-- Get the next state for new exam (typically status 1 for new exam)
			SELECT @no_estado_examen = ISNULL(MIN(no_estado_examen), 1) FROM [dbo].[ExamenEstado];

			INSERT INTO [dbo].[Examen] (
				[identificador],
				[no_examen],
				[no_paciente],
				[fecha_examen],
				[motivo],
				[no_estado_examen]
			)
			VALUES (
				@pno_empresa,
				@pno_examen,
				@pno_paciente,
				@pfecha_examen,
				@pmotivo,
				@no_estado_examen
			);

			SELECT @id_examen = SCOPE_IDENTITY();

			-- Process XML Graduaciones if provided
			IF @pxmlGraduaciones IS NOT NULL AND @pxmlGraduaciones <> ''
			BEGIN
				INSERT INTO [dbo].[ExamenGraduacion]
					([id_examen], [id_estructura_graduacion])
				SELECT
					@id_examen,
					ROW_NUMBER() OVER (ORDER BY T.c.value('(@id)[1]', 'INT')) as id_estructura_graduacion
				FROM (
					SELECT CAST(@pxmlGraduaciones AS XML)
				) AS A(xmldata)
				CROSS APPLY xmldata.nodes('/Graduaciones/Graduacion') AS T(c);
			END

			-- Process XML Disenos if provided
			IF @pxmlDisenos IS NOT NULL AND @pxmlDisenos <> ''
			BEGIN
				INSERT INTO [dbo].[ExamenDiseno]
					([id_examen], [codigo], [descripcion], [posicion])
				SELECT
					@id_examen,
					T.c.value('(codigo)[1]', 'NVARCHAR(50)'),
					T.c.value('(descripcion)[1]', 'NVARCHAR(100)'),
					ROW_NUMBER() OVER (ORDER BY T.c.value('(@id)[1]', 'INT')) as posicion
				FROM (
					SELECT CAST(@pxmlDisenos AS XML)
				) AS A(xmldata)
				CROSS APPLY xmldata.nodes('/Disenos/Diseno') AS T(c);
			END
		END
		ELSE IF @pTipoDML = 'U' OR @pTipoDML = 'u'
		BEGIN
			-- UPDATE operation
			UPDATE [dbo].[Examen]
			SET
				[motivo] = @pmotivo,
				[fecha_examen] = @pfecha_examen
			WHERE [no_examen] = @pno_examen
			  AND [no_paciente] = @pno_paciente;

			SELECT @id_examen = id_examen FROM [dbo].[Examen]
			WHERE [no_examen] = @pno_examen AND [no_paciente] = @pno_paciente;
		END

		COMMIT TRANSACTION;

		-- Return the exam number
		SELECT @pno_examen AS ExamNumber;

	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;

		-- Log error or handle as needed
		DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
		DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
		DECLARE @ErrorState INT = ERROR_STATE();

		RAISERROR(@ErrorMessage, @ErrorSeverity, @ErrorState);

		-- Return error indicator
		SELECT -1 AS ExamNumber;
	END CATCH

	SET NOCOUNT OFF;
END
GO
