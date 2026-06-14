using Softlithe.ERP.Abstracciones.Contenedores.Vendedores;

namespace Softlithe.ERP.Abstracciones.BW.Vendedores;

public interface IObtenerVendedorBW
{
    Task<VendedorConModeloDeValidacion> ObtenerVendedores(ParametroConsultaVendedor parametro);

    Task<VendedorConModeloDeValidacion> ObtenerVendedorPorUsuario(ParametroConsultaVendedorPorUsuario parametro);
}
