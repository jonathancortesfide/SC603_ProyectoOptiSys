using Softlithe.ERP.Abstracciones.BW.Enfermedades.AgregarEnfermedad;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.CambiarEstado;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerEnfermedadPorIdentificador;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerTodasLasEnfermedades;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.AgregarEnfermedad;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.CambiarEstado;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerEnfermedadPorIdentificador;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerTodasLasEnfermedades;
using Softlithe.ERP.BW.Enfermedades.AgregarEnfermedad;
using Softlithe.ERP.BW.Enfermedades.CambiarEstado;
using Softlithe.ERP.BW.Enfermedades.ObtenerEnfermedadPorIdentificador;
using Softlithe.ERP.BW.Enfermedades.ObtenerTodasLasEnfermedades;
using Softlithe.ERP.DA.Enfermedades.AgregarEnfermedad;
using Softlithe.ERP.DA.Enfermedades.CambiarEstado;
using Softlithe.ERP.DA.Enfermedades.ObtenerEnfermedadPorIdentificador;
using Softlithe.ERP.DA.Enfermedades.ObtenerTodasLasEnfermedades;

namespace Softlithe.ERP.Api.Inyeccion
{
	internal static class InyeccionDependenciasEnfermedades
	{
		internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
		{
			//Inyeccion de Obtener Todas las Enfermedades
			services.AddScoped<IObtenerTodasLasEnfermedadesDA, ObtenerTodasLasEnfermedadesDA>();
			services.AddScoped<IObtenerTodasLasEnfermedadesBW, ObtenerTodasLasEnfermedadesBW>();

			//Inyeccion de Obtener Enfermedad por Identificador
			services.AddScoped<IObtenerEnfermedadPorIdentificadorDA, ObtenerEnfermedadPorIdentificadorDA>();
			services.AddScoped<IObtenerEnfermedadPorIdentificadorBW, ObtenerEnfermedadPorIdentificadorBW>();

			//Inyeccion de Agregar Enfermedad
			services.AddScoped<IAgregarEnfermedadDA, AgregarEnfermedadDA>();
			services.AddScoped<IAgregarEnfermedadBW, AgregarEnfermedadBW>();

			//Inyeccion de Cambiar Estado de Enfermedad
			services.AddScoped<ICambiarEstadoEnfermedadDA, CambiarEstadoEnfermedadDA>();
			services.AddScoped<ICambiarEstadoEnfermedadBW, CambiarEstadoEnfermedadBW>();

			return services;
		}
	}
}
