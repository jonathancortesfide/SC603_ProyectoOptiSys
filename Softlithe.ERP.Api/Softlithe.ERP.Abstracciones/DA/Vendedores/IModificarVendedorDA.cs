using Softlithe.ERP.Abstracciones.Contenedores.Vendedores;

namespace Softlithe.ERP.Abstracciones.DA.Vendedores;

public interface IModificarVendedorDA
{
    Task<int> ModificarVendedor(ModificarVendedorDto dto);
}
