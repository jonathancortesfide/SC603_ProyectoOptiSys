using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;

namespace Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerEnfermedadCatalogo
{
    public interface IObtenerEnfermedadCatalogoBW
    {
        Task<List<EnfermedadCatalogoResponseDto>> ObtenerCatalogo();
    }
}
