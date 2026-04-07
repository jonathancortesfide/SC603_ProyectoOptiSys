using Softlithe.ERP.Abstracciones.BW.Pacientes.CambiarEstadoClasificacion;
using Softlithe.ERP.Abstracciones.DA.Pacientes.CambiarEstadoClasificacion;
using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Pacientes.CambiarEstadoClasificacion
{
    public class CambiarEstadoClasificacionBW : ICambiarEstadoClasificacionBW
    {
        private readonly ICambiarEstadoClasificacionDA _da;

        public CambiarEstadoClasificacionBW(ICambiarEstadoClasificacionDA da)
        {
            _da = da;
        }

        public async Task<ModeloValidacion> CambiarEstado(int no_clasificacion, int identificador, string usuario, bool activo)
        {
            return await _da.CambiarEstado(no_clasificacion, identificador, usuario, activo);
        }
    }
}
