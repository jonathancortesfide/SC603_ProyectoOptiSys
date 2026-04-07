using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Pacientes.AgregarClasificacion
{
    public interface IAgregarClasificacionBW
    {
        Task<ModeloValidacion> Agregar(PacienteClasificacionCrearDto dto);
    }
}
