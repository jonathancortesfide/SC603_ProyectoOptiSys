using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos
{
    [Keyless]
    [Table("Paciente")]
    public class Paciente
    {
        [Column("no_paciente")]
        public int numeroDePaciente { get; set; }

        [Column("identificador")]
        public int identificador { get; set; }

        [Column("tipoidentificacion")]
        public string? tipoIdentificacion { get; set; }

        [Column("cedula")]
        public string? cedula { get; set; }

        [Column("nombre")]
        public string? nombre { get; set; }

        [Column("direccion")]
        public string? direccion { get; set; }

        [Column("fechanacimiento")]
        public DateTime? fechaDeNacimiento { get; set; }

        [Column("email")]
        public string? email { get; set; }

        [Column("email2")]
        public string? email2 { get; set; }

        [Column("telefono1")]
        public string? telefono1 { get; set; }

        [Column("telefono2")]
        public string? telefono2 { get; set; }

        [Column("sexo")]
        public string? sexo { get; set; }

        [Column("plazo")]
        public int? plazo { get; set; }

        [Column("limitecredito")]
        public double? limiteDeCredito { get; set; }

        [Column("activo")]
        public bool? activo { get; set; }

        [Column("sinidentificacion")]
        public bool? sinIdentificacion { get; set; }

        [Column("fecharegistro")]
        public DateTime? fechaDeRegistro { get; set; }

        [Column("nombre_contacto_emergencia")]
        public string? nombreContactoEmergencia { get; set; }

        [Column("telefono_contacto_emergencia")]
        public string? telefonoContactoEmergencia { get; set; }

        [Column("es_empadronado")]
        public bool? esEmpadronado { get; set; }

        [Column("codigo_actividad")]
        public string? codigoActividad { get; set; }

        [Column("no_lista")]
        public int? noLista { get; set; }
    }
}
