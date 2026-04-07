using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos
{
[Table("Paciente")]
public class Paciente
{
    [Key]
    [Column("no_paciente")]
    public int no_paciente { get; set; }
    [Column("no_empresa")]
    public int no_empresa { get; set; }
    [Column("numero_de_paciente")]
    public string numero_de_paciente { get; set; } = string.Empty;
    [Column("tipo_identificacion")]
    public string tipo_identificacion { get; set; } = string.Empty;
    [Column("identificacion")]
    public string identificacion { get; set; } = string.Empty;
    [Column("nombre")]
    public string nombre { get; set; } = string.Empty;
    [Column("fecha_nacimiento")]
    public DateTime? fecha_nacimiento { get; set; }
    [Column("sexo")]
    public string? sexo { get; set; }
    [Column("no_pais_nacionalidad")]
    public int? no_pais_nacionalidad { get; set; }
    [Column("telefono1")]
    public string? telefono1 { get; set; }
    [Column("telefono2")]
    public string? telefono2 { get; set; }
    [Column("email1")]
    public string? email1 { get; set; }
    [Column("direccion")]
    public string? direccion { get; set; }
    [Column("no_envia_factura_electronica")]
    public bool no_envia_factura_electronica { get; set; }
    [Column("contacto_emergencia_nombre")]
    public string? contacto_emergencia_nombre { get; set; }
    [Column("contacto_emergencia_telefono")]
    public string? contacto_emergencia_telefono { get; set; }
    [Column("es_activo")]
    public bool es_activo { get; set; }
    [Column("fecha_creacion")]
    public DateTime fecha_creacion { get; set; }
    [Column("fecha_modificacion")]
    public DateTime? fecha_modificacion { get; set; }
}
}
