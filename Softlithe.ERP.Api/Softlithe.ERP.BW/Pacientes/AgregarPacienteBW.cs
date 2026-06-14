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
    public class AgregarPacienteBW : IAgregarPacienteBW
    {
        private readonly IPacienteRepository _pacienteRepository;
        private readonly IPacienteBC _pacienteBC;
        private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
        private readonly IErrorLogger _logger;

        public AgregarPacienteBW(
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

        public async Task<ModeloValidacion> AgregarPaciente(PacienteDto pacienteDto)
        {
            try
            {
                var validacion = await _pacienteBC.ValidarPacienteParaInsertar(pacienteDto);
                if (!validacion.EsCorrecto)
                {
                    return validacion;
                }

                int resultadoInsercion = await _pacienteRepository.InsertarPacienteAsync(pacienteDto);
                int respuestaBitacora = await AgregarEventoBitacoraCorrecto(pacienteDto, resultadoInsercion);

                return ConstruirRespuestaExitosa(resultadoInsercion, respuestaBitacora);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaExitosa(0, 1);
            }
        }

        private ModeloValidacion ConstruirRespuestaExitosa(int resultadoInsercion, int errorBitacora)
        {
            return new ModeloValidacion
            {
                Mensaje = (resultadoInsercion > 0 ? string.Format(MensajeDePacienteDto.PacienteAgregadoCorrectamente, "") : MensajeDePacienteDto.PacienteNoGuardar) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
                EsCorrecto = resultadoInsercion > 0
            };
        }

        private async Task<int> AgregarEventoBitacoraCorrecto(PacienteDto pacienteDto, int resultadoInsercion)
        {
            return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
            {
                descripcionDelEvento = resultadoInsercion > 0 ? string.Format(MensajeDePacienteDto.PacienteAgregadoCorrectamente, pacienteDto.Nombre) + ". Cédula: " + pacienteDto.Cedula : MensajeDePacienteDto.PacienteNoGuardar + ". Cédula: " + pacienteDto.Cedula,
                fechaDeRegistro = DateTime.Now,
                nombreDelMetodo = nameof(AgregarPaciente),
                tabla = "Paciente",
                idBitacora = Guid.NewGuid(),
                identificador = pacienteDto.Identificador,
                usuario = pacienteDto.Usuario
            });
        }
    }
}
