using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Pacientes.AgregarClasificacion
{
    public interface IAgregarClasificacionDA
    {
        Task<ModeloValidacion> Agregar(PacienteClasificacionCrearDto dto);
    }
}
