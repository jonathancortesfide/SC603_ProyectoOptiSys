using Softlithe.ERP.Abstracciones.Contenedores.Vendedores;

namespace Softlithe.ERP.Abstracciones.DA.Vendedores;

public interface IAgregarVendedorDA
{
    Task<int> AgregarVendedor(AgregarVendedorDto dto);
}
