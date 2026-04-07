using Softlithe.ERP.Abstracciones.Contenedores.Grupos;
using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Grupos.ModificarGrupo
{
    public interface IModificarGrupoBW
    {
        Task<ModeloValidacion> Modificar(GrupoModificarDto dto);
    }
}
