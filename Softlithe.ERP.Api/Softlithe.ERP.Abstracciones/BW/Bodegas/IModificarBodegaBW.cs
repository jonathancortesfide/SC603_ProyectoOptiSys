using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Bodegas;

namespace Softlithe.ERP.Abstracciones.BW.Bodegas;

public interface IModificarBodegaBW
{
    Task<ModeloValidacion> ModificarBodega(ModificarBodegaDto dto);
}
