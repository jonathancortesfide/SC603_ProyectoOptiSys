using Softlithe.ERP.Abstracciones.Contenedores.CajaMovimientos;

namespace Softlithe.ERP.Abstracciones.DA.CajaMovimientos;

public interface IAperturaCajaDA
{
    Task<AperturaCajaConModeloDeValidacion> AperturarCaja(AperturaCajaDto dto);
}
