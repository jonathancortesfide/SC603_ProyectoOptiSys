using Softlithe.ERP.Abstracciones.Contenedores.Cajas;

namespace Softlithe.ERP.Abstracciones.DA.Cajas;

public interface IModificarEstadoCajaDA
{
    Task<RespuestaCambiarEstadoCajaDA> ModificarEstadoCaja(ModificarEstadoCajaDto dto);
}
