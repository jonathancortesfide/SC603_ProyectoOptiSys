using Softlithe.ERP.Abstracciones.Contenedores.EmpresaSucursal;

namespace Softlithe.ERP.Abstracciones.BW.EmpresaSucursal
{
    public interface IObtenerEmpresaSucursalBW
    {
        Task<EmpresaConModeloDeValidacion> ObtenerEmpresasPorEmailUsuario(ParametroConsultaUsuarioPorEmail parametro);
        Task<SucursalConModeloDeValidacion> ObtenerSucursalesPorEmailUsuario(ParametroConsultaSucursalPorEmpresaEmail parametro);
        Task<ParametroFacturacionSucursalConModeloDeValidacion> ObtenerParametroFacturacionSucursal(int identificador);
    }
}
