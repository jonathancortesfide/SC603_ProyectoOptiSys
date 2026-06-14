using Softlithe.ERP.Abstracciones.Contenedores.Cajas;

namespace Softlithe.ERP.Abstracciones.DA.Cajas;

public interface IObtenerCajaDA
{
    Task<List<CajaDto>> ObtenerCajas(int identificador, string? nombre, bool soloActivas);
}
