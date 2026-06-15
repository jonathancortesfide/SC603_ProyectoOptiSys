using Softlithe.ERP.Abstracciones.Contenedores.Enfermedades;

namespace Softlithe.ERP.Abstracciones.BW.Enfermedades.ObtenerEnfermedadTipo
{
    public interface IObtenerEnfermedadTipoBW
    {
        Task<List<EnfermedadTipoDto>> ObtenerTipos();
    }
}
