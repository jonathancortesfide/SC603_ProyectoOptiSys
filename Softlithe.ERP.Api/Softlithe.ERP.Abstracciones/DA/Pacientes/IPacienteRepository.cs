using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;

namespace Softlithe.ERP.Abstracciones.DA.Pacientes
{
    public interface IPacienteRepository
    {
        Task<List<PacienteDto>> ObtenerPacientesAsync(int identificador, string? textoBusqueda);

        Task<PacienteDto?> ObtenerPacientePorIdAsync(int noPaciente);

        Task<int> InsertarPacienteAsync(PacienteDto pacienteDto);

        Task<int> ActualizarPacienteAsync(PacienteDto pacienteDto);

        Task<int> ModificaEstadoPacienteAsync(PacienteInActivaDto pacienteInActivaDto);
    }
}
