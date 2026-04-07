using Softlithe.ERP.Abstracciones.Contenedores.Grupos;
using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Grupos.AgregarGrupo
{
    public interface IAgregarGrupoBW
    {
        Task<ModeloValidacion> Agregar(GrupoCrearDto dto);
    }
}
