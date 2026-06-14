using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

/// <summary>
/// Catálogo de países (tabla Pais). Ajuste nombres de columnas si su esquema difiere.
/// </summary>
[Table("Pais")]
public partial class Pais
{
    [Key]
    [Column("no_pais")]
    public int NoPais { get; set; }

    [Column("descripcion")]
    [StringLength(200)]
    public string? Nombre { get; set; }
}
