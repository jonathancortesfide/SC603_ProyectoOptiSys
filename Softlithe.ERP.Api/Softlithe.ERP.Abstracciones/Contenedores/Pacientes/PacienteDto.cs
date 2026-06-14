using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using System.ComponentModel.DataAnnotations;

namespace Softlithe.ERP.Abstracciones.Contenedores.Pacientes
{
    public class PacienteDto
    {
        public int NoPaciente { get; set; }

        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
        public int Identificador { get; set; }

        public string? TipoIdentificacion { get; set; }

        [Required(ErrorMessage = MensajeDePacienteDto.CedulaPacienteRequerida)]
        public string Cedula { get; set; } = string.Empty;

        [Required(ErrorMessage = MensajeDePacienteDto.NombrePacienteRequerido)]
        public string Nombre { get; set; } = string.Empty;

        public string? Direccion { get; set; }

        public DateTime? FechaNacimiento { get; set; }

        public string? Email { get; set; }

        public string? Email2 { get; set; }

        public string? Telefono1 { get; set; }

        public string? Telefono2 { get; set; }

        public string? Sexo { get; set; }

        public int? Plazo { get; set; }

        public double? LimiteCredito { get; set; }

        public bool Activo { get; set; }

        public bool SinIdentificacion { get; set; }

        public DateTime? FechaRegistro { get; set; }

        public string? NombreContactoEmergencia { get; set; }

        public string? TelefonoContactoEmergencia { get; set; }

        public bool? EsEmpadronado { get; set; }

        public string? CodigoActividad { get; set; }

        /// <summary>
        /// Descripción desde ActividadEconomicaHacienda.nombre_actividad (consultas con JOIN).
        /// </summary>
        public string? NombreActividadEconomica { get; set; }

        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
        public string Usuario { get; set; } = string.Empty;
    }

    public class PacienteConModeloDeValidacion : ModeloValidacion
    {
        public List<PacienteDto> LaListaDePacientes { get; set; } = new List<PacienteDto>();
    }

    public class PacientePorIdConModeloDeValidacion : ModeloValidacion
    {
        public PacienteDto? Paciente { get; set; }
    }
}
