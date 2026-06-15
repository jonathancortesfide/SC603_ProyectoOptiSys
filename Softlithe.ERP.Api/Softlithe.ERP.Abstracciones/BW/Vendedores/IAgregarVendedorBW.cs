using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Vendedores;

namespace Softlithe.ERP.Abstracciones.BW.Vendedores;

public interface IAgregarVendedorBW
{
    Task<ModeloValidacion> AgregarVendedor(AgregarVendedorDto dto);
}
