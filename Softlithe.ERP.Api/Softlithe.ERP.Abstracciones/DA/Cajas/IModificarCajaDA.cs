using Softlithe.ERP.Abstracciones.Contenedores.Cajas;

namespace Softlithe.ERP.Abstracciones.DA.Cajas;

public interface IModificarCajaDA
{
    Task<int> ModificarCaja(ModificarCajaDto dto);
}
