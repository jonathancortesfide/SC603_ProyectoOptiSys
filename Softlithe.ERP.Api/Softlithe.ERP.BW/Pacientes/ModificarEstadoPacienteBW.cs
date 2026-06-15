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
    public class ModificarEstadoPacienteBW : IModificarEstadoPacienteBW
    {
        private readonly IPacienteRepository _pacienteRepository;
        private readonly IPacienteBC _pacienteBC;
        private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
        private readonly IErrorLogger _logger;

        public ModificarEstadoPacienteBW(
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

        public async Task<ModeloValidacion> ModificaEstadoPaciente(PacienteInActivaDto pacienteInActivaDto)
        {
            try
            {
                var validacion = await _pacienteBC.ValidarPacienteParaCambiarEstado(pacienteInActivaDto);
                if (!validacion.EsCorrecto)
                {
                    return validacion;
                }

                int resultadoCambioEstado = await _pacienteRepository.ModificaEstadoPacienteAsync(pacienteInActivaDto);
                int respuestaBitacora = await AgregarEventoBitacoraCorrecto(pacienteInActivaDto, resultadoCambioEstado);

                return ConstruirRespuestaExitosa(resultadoCambioEstado, pacienteInActivaDto.EsActivo, respuestaBitacora);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaExitosa(0, false, 1);
            }
        }

        private ModeloValidacion ConstruirRespuestaExitosa(int resultadoCambioEstado, bool estadoPacienteNuevo, int errorBitacora)
        {
            var estadoTexto = resultadoCambioEstado > 0 ? (estadoPacienteNuevo == true ? "Activo" : "Inactivo") : "Desconocido";
            return new ModeloValidacion
            {
                Mensaje = (resultadoCambioEstado > 0 ? string.Format(MensajeDePacienteDto.PacienteModificaEstadoCorrectamente, "", estadoTexto) : MensajeDePacienteDto.PacienteNoGuardar) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
                EsCorrecto = resultadoCambioEstado > 0
            };
        }

        private async Task<int> AgregarEventoBitacoraCorrecto(PacienteInActivaDto pacienteInActivaDto, int resultadoCambioEstado)
        {
            var estadoTexto = pacienteInActivaDto.EsActivo ? "Activo" : "Inactivo";
            return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
            {
                descripcionDelEvento = resultadoCambioEstado > 0 ? string.Format(MensajeDePacienteDto.PacienteModificaEstadoCorrectamente, "No. " + pacienteInActivaDto.NoPaciente, estadoTexto) : MensajeDePacienteDto.PacienteNoGuardar + ". No. Paciente: " + pacienteInActivaDto.NoPaciente,
                fechaDeRegistro = DateTime.Now,
                nombreDelMetodo = nameof(ModificaEstadoPaciente),
                tabla = "Paciente",
                idBitacora = Guid.NewGuid(),
                identificador = pacienteInActivaDto.Identificador,
                usuario = pacienteInActivaDto.Usuario
            });
        }
    }
}
