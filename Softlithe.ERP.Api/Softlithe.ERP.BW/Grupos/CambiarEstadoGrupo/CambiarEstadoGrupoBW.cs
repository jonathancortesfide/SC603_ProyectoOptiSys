using Softlithe.ERP.Abstracciones.BW.Grupos.CambiarEstadoGrupo;
using Softlithe.ERP.Abstracciones.DA.Grupos.CambiarEstadoGrupo;
using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Grupos.CambiarEstadoGrupo
{
    public class CambiarEstadoGrupoBW : ICambiarEstadoGrupoBW
    {
        private readonly ICambiarEstadoGrupoDA _da;

        public CambiarEstadoGrupoBW(ICambiarEstadoGrupoDA da)
        {
            _da = da;
        }

        public async Task<ModeloValidacion> CambiarEstado(int no_grupo, string usuario, bool activo)
        {
            return await _da.CambiarEstado(no_grupo, usuario, activo);
        }
    }
}
