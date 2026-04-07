using Softlithe.ERP.Abstracciones.Contenedores.Grupos;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Grupos.ObtenerGruposPorEmpresa
{
    public interface IObtenerGruposPorEmpresaBW
    {
        Task<GrupoConModeloDeValidacion> ObtenerPorEmpresa(int no_empresa);
    }
}
