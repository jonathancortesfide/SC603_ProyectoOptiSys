using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Pacientes;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.DA.Pacientes;

namespace Softlithe.ERP.BW.Pacientes
{
    public class ObtenerPacienteBW : IObtenerPacienteBW
    {
        private readonly IPacienteRepository _pacienteRepository;
        private readonly IErrorLogger _logger;

        public ObtenerPacienteBW(IPacienteRepository pacienteRepository, IErrorLogger errorLogger)
        {
            _pacienteRepository = pacienteRepository;
            _logger = errorLogger;
        }

        public async Task<PacienteConModeloDeValidacion> ObtenerPacientes(ParametroConsultaPaciente parametroConsultaPaciente)
        {
            try
            {
                List<PacienteDto> pacientes = await _pacienteRepository.ObtenerPacientesAsync(
                    parametroConsultaPaciente.Identificador,
                    parametroConsultaPaciente.TextoBusqueda);

                return ConstruirRespuestaListaExitosa(pacientes);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaListaExitosa(null);
            }
        }

        public async Task<PacientePorIdConModeloDeValidacion> ObtenerPacientePorId(ParametroPacientePorId parametroPacientePorId)
        {
            try
            {
                PacienteDto? paciente = await _pacienteRepository.ObtenerPacientePorIdAsync(
                    parametroPacientePorId.NoPaciente);

                if (paciente == null)
                {
                    return new PacientePorIdConModeloDeValidacion
                    {
                        Paciente = null,
                        Mensaje = MensajeDePacienteDto.PacienteNoEncontrado,
                        EsCorrecto = false
                    };
                }

                return new PacientePorIdConModeloDeValidacion
                {
                    Paciente = paciente,
                    Mensaje = MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                    EsCorrecto = true
                };
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return new PacientePorIdConModeloDeValidacion
                {
                    Paciente = null,
                    Mensaje = MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema,
                    EsCorrecto = false
                };
            }
        }

        private PacienteConModeloDeValidacion ConstruirRespuestaListaExitosa(List<PacienteDto>? laListaDePacientes)
        {
            return new PacienteConModeloDeValidacion
            {
                LaListaDePacientes = laListaDePacientes ?? new List<PacienteDto>(),
                Mensaje = laListaDePacientes == null ? MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema : MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = laListaDePacientes != null,
            };
        }
    }
}
