using Softlithe.ERP.Abstracciones.Contenedores.Bodegas;

namespace Softlithe.ERP.Abstracciones.DA.Bodegas;

public interface IAgregarBodegaDA
{
    Task<int> AgregarBodega(AgregarBodegaDto dto);
}
