using Softlithe.ERP.Abstracciones.BC.Generico;
using Softlithe.ERP.Abstracciones.DA.ConexionALaBaseDeDatos;
using Softlithe.ERP.Abstracciones.DA.GestionBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.DA;
using Softlithe.ERP.BW.Generico;
using Softlithe.ERP.DA.Datos_Facturacion_Electronica;
using Softlithe.ERP.DA.GestionBitacora.AgregarEventoBitacora;
using Softlithe.ERP.DA.Modelos;
using Softlithe.ERP.Abstracciones.BW.Examenes.AgregarExamen;
using Softlithe.ERP.Abstracciones.DA.Examenes.AgregarExamen;
using Softlithe.ERP.Abstracciones.BW.Examenes;
using Softlithe.ERP.Abstracciones.DA.Examenes;
using Softlithe.ERP.BW.Examenes.AgregarExamen;
using Softlithe.ERP.DA.Examenes.AgregarExamen;
using Softlithe.ERP.BW.Examenes.ObtenerExamenCompleto;
using Softlithe.ERP.DA.Examenes.ObtenerExamenGraduaciones;

namespace Softlithe.ERP.Api.Inyeccion
{
	internal static class InyeccionDeDependenciasExamenes
	{
		internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
		{
			//Inyeccion de Examenes - Agregar
			services.AddScoped<IAgregarExamenDA, AgregarExamenDA>();
			services.AddScoped<IAgregarExamenBW, AgregarExamenBW>();

			//Inyeccion de Examenes - Obtener
			services.AddScoped<IObtenerExamenGraduacionesAD, ObtenerExamenGraduacionesAD>();
			services.AddScoped<IObtenerExamenCompletoBW, ObtenerExamenCompletoBW>();

			return services;
		}
	}
}
