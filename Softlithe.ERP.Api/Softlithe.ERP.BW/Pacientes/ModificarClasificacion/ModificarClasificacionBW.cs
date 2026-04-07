using Softlithe.ERP.Abstracciones.BW.Pacientes.ModificarClasificacion;
using Softlithe.ERP.Abstracciones.DA.Pacientes.ModificarClasificacion;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Pacientes.ModificarClasificacion
{
    public class ModificarClasificacionBW : IModificarClasificacionBW
    {
        private readonly IModificarClasificacionDA _da;

        public ModificarClasificacionBW(IModificarClasificacionDA da)
        {
            _da = da;
        }

        public async Task<ModeloValidacion> Modificar(PacienteClasificacionDto dto)
        {
            return await _da.Modificar(dto);
        }
    }
}
