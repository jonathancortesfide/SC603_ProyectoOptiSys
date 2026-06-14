using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;

namespace Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerEnfermedadCatalogo
{
    public interface IObtenerEnfermedadCatalogoDA
    {
        Task<List<EnfermedadCatalogoResponseDto>> ObtenerCatalogo();
    }
}
