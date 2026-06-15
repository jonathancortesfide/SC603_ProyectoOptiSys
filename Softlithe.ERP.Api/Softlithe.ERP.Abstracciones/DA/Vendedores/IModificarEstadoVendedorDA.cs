using Softlithe.ERP.Abstracciones.Contenedores.Vendedores;

namespace Softlithe.ERP.Abstracciones.DA.Vendedores;

public interface IModificarEstadoVendedorDA
{
    Task<RespuestaCambiarEstadoVendedorDA> ModificarEstadoVendedor(ModificarEstadoVendedorDto dto);
}
