using Softlithe.ERP.Abstracciones.Contenedores.CajaMovimientos;

namespace Softlithe.ERP.Abstracciones.DA.CajaMovimientos;

public interface IAgregarCajaMovimientoDA
{
    Task<int> AgregarMovimiento(AgregarCajaMovimientoDto dto);
}
