using Softlithe.ERP.Abstracciones.Contenedores.CajaMovimientos;

namespace Softlithe.ERP.Abstracciones.DA.CajaMovimientos;

public interface IObtenerCajaMovimientoDA
{
    Task<List<CajaMovimientoDto>> ObtenerMovimientos(int idCierre);

    Task<CajaCierreDto?> ObtenerCierreActivo(int noCaja, int identificador);
}
