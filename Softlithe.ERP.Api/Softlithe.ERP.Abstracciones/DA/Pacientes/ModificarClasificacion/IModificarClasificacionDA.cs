using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Pacientes.ModificarClasificacion
{
    public interface IModificarClasificacionDA
    {
        Task<ModeloValidacion> Modificar(PacienteClasificacionDto dto);
    }
}
