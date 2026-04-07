/****** Object:  Table [dbo].[Bitacora]    Script Date: 15/11/2025 10:49:23 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE [dbo].[Bitacora](
	[no_bitacora] [uniqueidentifier] NOT NULL,
	[identificador] [int] NOT NULL,
	[usuario] [varchar](100) NULL,
	[descripcion_evento] [varchar](max) NULL,
	[fecha_registro] [datetime] NULL,
	[nombre_metodo] [varchar](200) NULL,
	[tabla] [varchar](50) NULL,
	[mensaje_excepcion] [varchar](max) NULL,
	[stack_trace][varchar](max) NULL,
 CONSTRAINT [PK_Bitacora] PRIMARY KEY CLUSTERED 
(
	[no_bitacora] ASC,
	[identificador] ASC
)WITH (STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO


