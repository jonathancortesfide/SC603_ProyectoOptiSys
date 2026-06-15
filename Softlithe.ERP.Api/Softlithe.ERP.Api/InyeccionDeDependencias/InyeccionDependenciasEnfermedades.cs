using Softlithe.ERP.Abstracciones.BW.Enfermedades.AgregarEnfermedad;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.AgregarEnfermedadCatalogo;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.AgregarEnfermedadConCatalogo;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.CambiarEstado;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerEnfermedadCatalogo;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerEnfermedadPorIdentificador;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerEnfermedadTipo;
using Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerTodasLasEnfermedades;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.AgregarEnfermedad;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.AgregarEnfermedadCatalogo;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.AgregarEnfermedadConCatalogo;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.CambiarEstado;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerEnfermedadCatalogo;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerEnfermedadPorIdentificador;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerEnfermedadTipo;
using Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerTodasLasEnfermedades;
using Softlithe.ERP.BW.Enfermedades.AgregarEnfermedad;
using Softlithe.ERP.BW.Enfermedades.AgregarEnfermedadCatalogo;
using Softlithe.ERP.BW.Enfermedades.AgregarEnfermedadConCatalogo;
using Softlithe.ERP.BW.Enfermedades.CambiarEstado;
using Softlithe.ERP.BW.Enfermedades.ObtenerEnfermedadCatalogo;
using Softlithe.ERP.BW.Enfermedades.ObtenerEnfermedadPorIdentificador;
using Softlithe.ERP.BW.Enfermedades.ObtenerEnfermedadTipo;
using Softlithe.ERP.BW.Enfermedades.ObtenerTodasLasEnfermedades;
using Softlithe.ERP.DA.Enfermedades.AgregarEnfermedad;
using Softlithe.ERP.DA.Enfermedades.AgregarEnfermedadCatalogo;
using Softlithe.ERP.DA.Enfermedades.AgregarEnfermedadConCatalogo;
using Softlithe.ERP.DA.Enfermedades.CambiarEstado;
using Softlithe.ERP.DA.Enfermedades.ObtenerEnfermedadCatalogo;
using Softlithe.ERP.DA.Enfermedades.ObtenerEnfermedadPorIdentificador;
using Softlithe.ERP.DA.Enfermedades.ObtenerEnfermedadTipo;
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

			//Inyeccion de Obtener Catálogo de Enfermedades
			services.AddScoped<IObtenerEnfermedadCatalogoDA, ObtenerEnfermedadCatalogoDA>();
			services.AddScoped<IObtenerEnfermedadCatalogoBW, ObtenerEnfermedadCatalogoBW>();

			//Inyeccion de Agregar Enfermedad al Catálogo
			services.AddScoped<IAgregarEnfermedadCatalogoDA, AgregarEnfermedadCatalogoDA>();
			services.AddScoped<IAgregarEnfermedadCatalogoBW, AgregarEnfermedadCatalogoBW>();

			//Inyeccion de Agregar Enfermedad con Catálogo
			services.AddScoped<IAgregarEnfermedadConCatalogoDA, AgregarEnfermedadConCatalogoDA>();
			services.AddScoped<IAgregarEnfermedadConCatalogoBW, AgregarEnfermedadConCatalogoBW>();

			//Inyeccion de Obtener Tipos de Enfermedad
			services.AddScoped<IObtenerEnfermedadTipoDA, ObtenerEnfermedadTipoDA>();
			services.AddScoped<IObtenerEnfermedadTipoBW, ObtenerEnfermedadTipoBW>();

			return services;
		}
	}
}

