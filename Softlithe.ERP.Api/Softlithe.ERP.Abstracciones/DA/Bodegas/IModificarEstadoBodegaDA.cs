using Softlithe.ERP.Abstracciones.Contenedores.Bodegas;

namespace Softlithe.ERP.Abstracciones.DA.Bodegas;

public interface IModificarEstadoBodegaDA
{
    Task<RespuestaCambiarEstadoBodegaDA> ModificarEstadoBodega(ModificarEstadoBodegaDto dto);
}
