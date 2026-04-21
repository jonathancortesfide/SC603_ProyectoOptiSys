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
			InyeccionDeDependenciasProductos.InyectarDependencias(services);
			InyeccionDeDependenciasExamenes.InyectarDependencias(services);
			InyeccionDependenciasMonedas.InyectarDependencias(services);
			InyeccionDependenciasGrupos.InyectarDependencias(services);
            InyeccionDeDependenciasTipoLente.InyectarDependencias(services);
            InyeccionDeDependenciaListaPrecio.InyectarDependenciasListaPrecio(services);

            return services;
        }
    }
}
