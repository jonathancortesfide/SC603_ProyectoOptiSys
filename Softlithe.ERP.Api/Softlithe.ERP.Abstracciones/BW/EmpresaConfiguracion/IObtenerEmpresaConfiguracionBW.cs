using Softlithe.ERP.Abstracciones.Contenedores.EmpresaConfiguracion;

namespace Softlithe.ERP.Abstracciones.BW.EmpresaConfiguracion
{
    public interface IObtenerEmpresaConfiguracionBW
    {
        Task<ActividadEcoEmpresaConModeloDeValidacion> ObtenerActividadEconomicaEmpresa(int identificador);

        Task<ParametroFactConModeloDeValidacion> ObtenerParametroFacturacionEmpresa(int identificador);
    }
}
