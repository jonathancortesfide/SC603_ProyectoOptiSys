using Softlithe.ERP.Abstracciones.Contenedores.EmpresaConfiguracion;

namespace Softlithe.ERP.Abstracciones.DA.EmpresaConfiguracion
{
    public interface IObtenerEmpresaConfiguracionDA
    {
        Task<List<ActividadEconomicaEmpresaDto>> ObtenerActividadesEconomicasPorIdentificador(int identificador);

        Task<ParametroFacturacionEmpresaDto?> ObtenerParametroFacturacionPorIdentificador(int identificador);
    }
}
