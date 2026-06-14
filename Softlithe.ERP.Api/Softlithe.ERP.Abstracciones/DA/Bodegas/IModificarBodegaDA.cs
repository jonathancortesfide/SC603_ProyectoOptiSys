using Softlithe.ERP.Abstracciones.Contenedores.Bodegas;

namespace Softlithe.ERP.Abstracciones.DA.Bodegas;

public interface IModificarBodegaDA
{
    Task<int> ModificarBodega(ModificarBodegaDto dto);
}
