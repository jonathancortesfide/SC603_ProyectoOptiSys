using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("Vendedor")]
public class Vendedor
{
    [Key]
    [Column("no_vendedor")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int NoVendedor { get; set; }

    [Column("descripcion")]
    [StringLength(50)]
    public string? Descripcion { get; set; }

    [Column("identificador")]
    public int Identificador { get; set; }

    [Column("id_usuario")]
    public int? IdUsuario { get; set; }

    /// <summary>
    /// Activo/inactivo. Requiere columna <c>activo</c> en la tabla (ver script SQL en Database).
    /// </summary>
    [Column("activo")]
    public bool Activo { get; set; } = true;
}
