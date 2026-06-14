using Softlithe.ERP.Abstracciones.BC.Pacientes;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;

namespace Softlithe.ERP.BC.Pacientes
{
    public class PacienteBC : IPacienteBC
    {
        public Task<ModeloValidacion> ValidarPacienteParaInsertar(PacienteDto pacienteDto)
        {
            var validacion = new ModeloValidacion
            {
                Mensaje = string.Empty,
                EsCorrecto = true
            };

            if (pacienteDto == null)
            {
                validacion.Mensaje = "El paciente no puede ser nulo.";
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (pacienteDto.Identificador <= 0)
            {
                validacion.Mensaje = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(pacienteDto.Nombre))
            {
                validacion.Mensaje = MensajeDePacienteDto.NombrePacienteRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(pacienteDto.Cedula))
            {
                validacion.Mensaje = MensajeDePacienteDto.CedulaPacienteRequerida;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(pacienteDto.Usuario))
            {
                validacion.Mensaje = MensajesGeneralesDelSistemaDto.UsuarioRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            validacion.Mensaje = "Validación correcta.";
            return Task.FromResult(validacion);
        }

        public Task<ModeloValidacion> ValidarPacienteParaActualizar(PacienteDto pacienteDto)
        {
            var validacion = new ModeloValidacion
            {
                Mensaje = string.Empty,
                EsCorrecto = true
            };

            if (pacienteDto == null)
            {
                validacion.Mensaje = "El paciente no puede ser nulo.";
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (pacienteDto.NoPaciente <= 0)
            {
                validacion.Mensaje = MensajeDePacienteDto.CodigoPacienteRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (pacienteDto.Identificador <= 0)
            {
                validacion.Mensaje = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(pacienteDto.Nombre))
            {
                validacion.Mensaje = MensajeDePacienteDto.NombrePacienteRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(pacienteDto.Cedula))
            {
                validacion.Mensaje = MensajeDePacienteDto.CedulaPacienteRequerida;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(pacienteDto.Usuario))
            {
                validacion.Mensaje = MensajesGeneralesDelSistemaDto.UsuarioRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            validacion.Mensaje = "Validación correcta.";
            return Task.FromResult(validacion);
        }

        public Task<ModeloValidacion> ValidarPacienteParaCambiarEstado(PacienteInActivaDto pacienteInActivaDto)
        {
            var validacion = new ModeloValidacion
            {
                Mensaje = string.Empty,
                EsCorrecto = true
            };

            if (pacienteInActivaDto == null)
            {
                validacion.Mensaje = "El paciente no puede ser nulo.";
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (pacienteInActivaDto.NoPaciente <= 0)
            {
                validacion.Mensaje = MensajeDePacienteDto.CodigoPacienteRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (pacienteInActivaDto.Identificador <= 0)
            {
                validacion.Mensaje = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            if (string.IsNullOrWhiteSpace(pacienteInActivaDto.Usuario))
            {
                validacion.Mensaje = MensajesGeneralesDelSistemaDto.UsuarioRequerido;
                validacion.EsCorrecto = false;
                return Task.FromResult(validacion);
            }

            validacion.Mensaje = "Validación correcta.";
            return Task.FromResult(validacion);
        }
    }
}
