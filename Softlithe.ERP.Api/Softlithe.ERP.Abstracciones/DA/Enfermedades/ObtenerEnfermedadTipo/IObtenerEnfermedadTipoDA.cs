using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;

namespace Softlithe.ERP.Abstracciones.DA.Enfermedades.ObtenerEnfermedadTipo
{
    public interface IObtenerEnfermedadTipoDA
    {
        Task<List<EnfermedadTipoDto>> ObtenerTipos();
    }
}
