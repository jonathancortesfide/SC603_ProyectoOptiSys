using Softlithe.ERP.Abstracciones.Contenedores.Grupos;
using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Grupos.AgregarGrupo
{
    public interface IAgregarGrupoDA
    {
        Task<ModeloValidacion> Agregar(GrupoCrearDto dto);
    }
}
