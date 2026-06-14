using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;

namespace Softlithe.ERP.Abstracciones.BW.Pacientes
{
    public interface IObtenerPacienteBW
    {
        Task<PacienteConModeloDeValidacion> ObtenerPacientes(ParametroConsultaPaciente parametroConsultaPaciente);

        Task<PacientePorIdConModeloDeValidacion> ObtenerPacientePorId(ParametroPacientePorId parametroPacientePorId);
    }
}
