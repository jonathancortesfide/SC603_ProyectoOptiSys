using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Softlithe.ERP.DA.Modelos;

[Keyless]
[Table("EmpresaActividadEconomica")]
public class EmpresaActividadEconomica
{
    [Column("identificador")]
    public int Identificador { get; set; }

    [Column("codigo_actividad")]
    public string CodigoActividad { get; set; } = string.Empty;

    [Column("descripcion")]
    public string? Descripcion { get; set; }

    [Column("activo")]
    public bool Activo { get; set; }

    [Column("valor_por_defecto")]
    public bool ValorPorDefecto { get; set; }
}
