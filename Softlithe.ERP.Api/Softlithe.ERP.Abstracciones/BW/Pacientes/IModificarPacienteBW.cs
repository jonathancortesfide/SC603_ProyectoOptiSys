using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;

namespace Softlithe.ERP.Abstracciones.BW.Pacientes
{
    public interface IModificarPacienteBW
    {
        Task<ModeloValidacion> ModificarPaciente(PacienteDto pacienteDto);
    }
}
