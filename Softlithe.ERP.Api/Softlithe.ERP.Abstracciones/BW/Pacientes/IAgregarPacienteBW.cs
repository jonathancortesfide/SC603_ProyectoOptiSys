using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;

namespace Softlithe.ERP.Abstracciones.BW.Pacientes
{
    public interface IAgregarPacienteBW
    {
        Task<ModeloValidacion> AgregarPaciente(PacienteDto pacienteDto);
    }
}
