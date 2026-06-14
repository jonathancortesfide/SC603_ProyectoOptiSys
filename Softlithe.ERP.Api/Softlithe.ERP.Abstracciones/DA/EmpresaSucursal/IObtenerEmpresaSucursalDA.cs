using Softlithe.ERP.Abstracciones.Contenedores.EmpresaSucursal;

namespace Softlithe.ERP.Abstracciones.DA.EmpresaSucursal
{
    public interface IObtenerEmpresaSucursalDA
    {
        Task<List<EmpresaDto>> ObtenerEmpresasPorEmailUsuario(string email);
        Task<List<SucursalDto>> ObtenerSucursalesPorEmailUsuario(string email, int noEmpresa);
        Task<ParametroFacturacionSucursalDto?> ObtenerParametroFacturacionSucursalPorIdentificador(int identificador);
    }
}
