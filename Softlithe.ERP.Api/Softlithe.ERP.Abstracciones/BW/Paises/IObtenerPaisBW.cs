using Softlithe.ERP.Abstracciones.Contenedores.Paises;

namespace Softlithe.ERP.Abstracciones.BW.Paises;

public interface IObtenerPaisBW
{
    Task<PaisConModeloDeValidacion> ObtenerPaises(ParametroConsultaPais parametroConsultaPais);
}
