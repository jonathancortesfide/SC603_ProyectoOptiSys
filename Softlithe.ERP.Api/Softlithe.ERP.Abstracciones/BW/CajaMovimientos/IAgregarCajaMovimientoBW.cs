using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.CajaMovimientos;

namespace Softlithe.ERP.Abstracciones.BW.CajaMovimientos;

public interface IAgregarCajaMovimientoBW
{
    Task<ModeloValidacion> AgregarMovimiento(AgregarCajaMovimientoDto dto);
}
