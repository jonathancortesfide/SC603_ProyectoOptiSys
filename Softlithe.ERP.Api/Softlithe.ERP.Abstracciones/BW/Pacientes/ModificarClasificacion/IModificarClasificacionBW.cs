using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Pacientes.ModificarClasificacion
{
    public interface IModificarClasificacionBW
    {
        Task<ModeloValidacion> Modificar(PacienteClasificacionDto dto);
    }
}
