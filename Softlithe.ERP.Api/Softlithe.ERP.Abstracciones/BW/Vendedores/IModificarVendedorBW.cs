using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Vendedores;

namespace Softlithe.ERP.Abstracciones.BW.Vendedores;

public interface IModificarVendedorBW
{
    Task<ModeloValidacion> ModificarVendedor(ModificarVendedorDto dto);
}
