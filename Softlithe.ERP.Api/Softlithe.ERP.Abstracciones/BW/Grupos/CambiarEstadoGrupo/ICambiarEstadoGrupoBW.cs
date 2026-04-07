using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Grupos.CambiarEstadoGrupo
{
    public interface ICambiarEstadoGrupoBW
    {
        Task<ModeloValidacion> CambiarEstado(int no_grupo, string usuario, bool activo);
    }
}
