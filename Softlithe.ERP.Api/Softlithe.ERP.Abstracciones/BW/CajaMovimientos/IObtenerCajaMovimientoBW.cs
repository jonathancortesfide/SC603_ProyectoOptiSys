using Softlithe.ERP.Abstracciones.Contenedores.CajaMovimientos;

namespace Softlithe.ERP.Abstracciones.BW.CajaMovimientos;

public interface IObtenerCajaMovimientoBW
{
    Task<CajaMovimientoConModeloDeValidacion> ObtenerMovimientos(ParametroConsultaCajaMovimiento parametro);

    Task<CajaCierreConModeloDeValidacion> ObtenerCierreActivo(ParametroConsultaCierreActivo parametro);
}
