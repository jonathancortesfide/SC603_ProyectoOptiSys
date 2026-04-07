using Softlithe.ERP.Abstracciones.BW.Grupos.ModificarGrupo;
using Softlithe.ERP.Abstracciones.DA.Grupos.ModificarGrupo;
using Softlithe.ERP.Abstracciones.Contenedores.Grupos;
using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Grupos.ModificarGrupo
{
    public class ModificarGrupoBW : IModificarGrupoBW
    {
        private readonly IModificarGrupoDA _da;

        public ModificarGrupoBW(IModificarGrupoDA da)
        {
            _da = da;
        }

        public async Task<ModeloValidacion> Modificar(GrupoModificarDto dto)
        {
            return await _da.Modificar(dto);
        }
    }
}
