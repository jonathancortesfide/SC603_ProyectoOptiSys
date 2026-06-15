using Softlithe.ERP.Abstracciones.Contenedores.CajaMovimientos;

namespace Softlithe.ERP.Abstracciones.BW.CajaMovimientos;

public interface IAperturaCajaBW
{
    Task<AperturaCajaConModeloDeValidacion> AperturarCaja(AperturaCajaDto dto);
}
