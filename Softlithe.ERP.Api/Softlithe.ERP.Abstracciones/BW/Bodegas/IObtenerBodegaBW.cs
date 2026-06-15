using Softlithe.ERP.Abstracciones.Contenedores.Bodegas;

namespace Softlithe.ERP.Abstracciones.BW.Bodegas;

public interface IObtenerBodegaBW
{
    Task<BodegaConModeloDeValidacion> ObtenerBodegas(ParametroConsultaBodega parametro);
}
