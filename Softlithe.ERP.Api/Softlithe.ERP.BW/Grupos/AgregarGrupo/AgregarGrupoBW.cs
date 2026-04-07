using Softlithe.ERP.Abstracciones.BW.Grupos.AgregarGrupo;
using Softlithe.ERP.Abstracciones.DA.Grupos.AgregarGrupo;
using Softlithe.ERP.Abstracciones.Contenedores.Grupos;
using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Grupos.AgregarGrupo
{
    public class AgregarGrupoBW : IAgregarGrupoBW
    {
        private readonly IAgregarGrupoDA _da;

        public AgregarGrupoBW(IAgregarGrupoDA da)
        {
            _da = da;
        }

        public async Task<ModeloValidacion> Agregar(GrupoCrearDto dto)
        {
            return await _da.Agregar(dto);
        }
    }
}
