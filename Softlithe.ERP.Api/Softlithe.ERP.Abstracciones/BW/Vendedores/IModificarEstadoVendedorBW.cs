using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Vendedores;

namespace Softlithe.ERP.Abstracciones.BW.Vendedores;

public interface IModificarEstadoVendedorBW
{
    Task<ModeloValidacion> ModificarEstadoVendedor(ModificarEstadoVendedorDto dto);
}
