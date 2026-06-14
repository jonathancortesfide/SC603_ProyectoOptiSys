using Softlithe.ERP.Api.Inyeccion;

namespace Softlithe.ERP.Api
{
	internal static class InyeccionDeDependencias
    { 
		internal static IServiceCollection InyectarDependencias(this IServiceCollection services)
		{
			//Inyeccion de dependencias generales
			InyeccionDeDependenciasGenerales.InyectarDependencias(services);
			InyeccionDeDependenciasPacientes.InyectarDependencias(services);
			InyeccionDeDependenciasExamenes.InyectarDependencias(services);
			InyeccionDependenciasMonedas.InyectarDependencias(services);
			InyeccionDependenciasGrupos.InyectarDependencias(services);
			InyeccionDeDependenciasTipoLente.InyectarDependencias(services);
			InyeccionDeDependenciaListaPrecio.InyectarDependenciasListaPrecio(services);
			InyeccionDependenciasEnfermedades.InyectarDependencias(services);
            InyeccionDeDependenciasProveedores.InyectarDependencias(services);
            InyeccionDeDependenciaPaises.InyectarDependencias(services);
            InyeccionDeDependenciaMarcas.InyectarDependencias(services);
            InyeccionDeDependenciaEmpresaSucursal.InyectarDependencias(services);
            InyeccionDeDependenciaBodegas.InyectarDependencias(services);
            InyeccionDeDependenciaEmpresaConfiguracion.InyectarDependencias(services);
            InyeccionDeDependenciaActividadEconomicaHacienda.InyectarDependencias(services);
            InyeccionDeDependenciasProductos.InyectarDependencias(services);
            InyeccionDeDependenciaVendedores.InyectarDependencias(services);
            InyeccionDeDependenciaCajas.InyectarDependencias(services);
			InyeccionDeDependenciaUsuarios.InyectarDependencias(services);
			InyeccionDeDependenciasSeguridad.InyectarDependencias(services);

			return services;
		}
	}
}
