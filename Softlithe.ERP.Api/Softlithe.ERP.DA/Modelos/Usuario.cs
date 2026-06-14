using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("Usuario")]
public class Usuario
{
    [Key]
    [Column("id_usuario")]
    public int IdUsuario { get; set; }

    [Column("id_identity_server")]
    public string IdIdentityServer { get; set; } = string.Empty;

    [Column("identificador")]
    public int Identificador { get; set; }

    [Column("nombre")]
    public string? Nombre { get; set; }

    [Column("esdoctor")]
    public bool? EsDoctor { get; set; }

    [Column("codigo_profesional")]
    public string? CodigoProfesional { get; set; }

    [Column("email")]
    public string? Email { get; set; }

    [Column("telefono")]
    public string? Telefono { get; set; }

    [Column("direccion")]
    public string? Direccion { get; set; }

    [Column("fecha_nacimiento")]
    public DateTime? FechaNacimiento { get; set; }

    [Column("activo")]
    public bool Activo { get; set; }

    public virtual ICollection<UsuarioEmpresaSucursal> UsuarioEmpresaSucursales { get; set; } = new List<UsuarioEmpresaSucursal>();
}
