using Softlithe.ERP.Abstracciones.BW.Pacientes.AgregarClasificacion;
using Softlithe.ERP.Abstracciones.DA.Pacientes.AgregarClasificacion;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Pacientes.AgregarClasificacion
{
    public class AgregarClasificacionBW : IAgregarClasificacionBW
    {
        private readonly IAgregarClasificacionDA _da;

        public AgregarClasificacionBW(IAgregarClasificacionDA da)
        {
            _da = da;
        }

        public async Task<ModeloValidacion> Agregar(PacienteClasificacionCrearDto dto)
        {
            return await _da.Agregar(dto);
        }
    }
}
