using Softlithe.ERP.Abstracciones.Contenedores.Grupos;
using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Grupos.ModificarGrupo
{
    public interface IModificarGrupoDA
    {
        Task<ModeloValidacion> Modificar(GrupoModificarDto dto);
    }
}
