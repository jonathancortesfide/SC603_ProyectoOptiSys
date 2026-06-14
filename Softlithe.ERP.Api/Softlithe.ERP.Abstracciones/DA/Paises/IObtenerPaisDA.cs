using Softlithe.ERP.Abstracciones.Contenedores.Paises;

namespace Softlithe.ERP.Abstracciones.DA.Paises;

public interface IObtenerPaisDA
{
    Task<List<PaisDto>> ObtenerPaises(string nombreFiltro);
}
