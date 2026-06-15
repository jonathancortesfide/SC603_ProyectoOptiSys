using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;

namespace Softlithe.ERP.Abstracciones.BC.Pacientes
{
    public interface IPacienteBC
    {
        Task<ModeloValidacion> ValidarPacienteParaInsertar(PacienteDto pacienteDto);

        Task<ModeloValidacion> ValidarPacienteParaActualizar(PacienteDto pacienteDto);

        Task<ModeloValidacion> ValidarPacienteParaCambiarEstado(PacienteInActivaDto pacienteInActivaDto);
    }
}
