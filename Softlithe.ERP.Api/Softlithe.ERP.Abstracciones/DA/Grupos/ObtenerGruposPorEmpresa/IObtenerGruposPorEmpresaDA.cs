using Softlithe.ERP.Abstracciones.Contenedores.Grupos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Grupos.ObtenerGruposPorEmpresa
{
    public interface IObtenerGruposPorEmpresaDA
    {
        Task<List<GrupoDto>> ObtenerPorEmpresa(int no_empresa);
    }
}
