using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Grupos.CambiarEstadoGrupo
{
    public interface ICambiarEstadoGrupoDA
    {
        Task<ModeloValidacion> CambiarEstado(int no_grupo, string usuario, bool activo);
    }
}
