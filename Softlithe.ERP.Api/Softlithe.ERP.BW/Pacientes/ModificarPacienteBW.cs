using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Pacientes;
using Softlithe.ERP.Abstracciones.BC.Pacientes;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.DA.Pacientes;

namespace Softlithe.ERP.BW.Pacientes
{
    public class ModificarPacienteBW : IModificarPacienteBW
    {
        private readonly IPacienteRepository _pacienteRepository;
        private readonly IPacienteBC _pacienteBC;
        private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
        private readonly IErrorLogger _logger;

        public ModificarPacienteBW(
            IPacienteRepository pacienteRepository,
            IPacienteBC pacienteBC,
            IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
            IErrorLogger errorLogger)
        {
            _pacienteRepository = pacienteRepository;
            _pacienteBC = pacienteBC;
            _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
            _logger = errorLogger;
        }

        public async Task<ModeloValidacion> ModificarPaciente(PacienteDto pacienteDto)
        {
            try
            {
                var validacion = await _pacienteBC.ValidarPacienteParaActualizar(pacienteDto);
                if (!validacion.EsCorrecto)
                {
                    return validacion;
                }

                int resultadoActualizacion = await _pacienteRepository.ActualizarPacienteAsync(pacienteDto);
                int respuestaBitacora = await AgregarEventoBitacoraCorrecto(pacienteDto, resultadoActualizacion);

                return ConstruirRespuestaExitosa(resultadoActualizacion, respuestaBitacora);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaExitosa(0, 1);
            }
        }

        private ModeloValidacion ConstruirRespuestaExitosa(int resultadoActualizacion, int errorBitacora)
        {
            return new ModeloValidacion
            {
                Mensaje = (resultadoActualizacion > 0 ? string.Format(MensajeDePacienteDto.PacienteModificadoCorrectamente, "") : MensajeDePacienteDto.PacienteNoGuardar) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
                EsCorrecto = resultadoActualizacion > 0
            };
        }

        private async Task<int> AgregarEventoBitacoraCorrecto(PacienteDto pacienteDto, int resultadoActualizacion)
        {
            return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
            {
                descripcionDelEvento = resultadoActualizacion > 0 ? string.Format(MensajeDePacienteDto.PacienteModificadoCorrectamente, pacienteDto.Nombre) + ". Cédula: " + pacienteDto.Cedula : MensajeDePacienteDto.PacienteNoGuardar + ". Cédula: " + pacienteDto.Cedula,
                fechaDeRegistro = DateTime.Now,
                nombreDelMetodo = nameof(ModificarPaciente),
                tabla = "Paciente",
                idBitacora = Guid.NewGuid(),
                identificador = pacienteDto.Identificador,
                usuario = pacienteDto.Usuario
            });
        }
    }
}
