using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Softlithe.ERP.DA.Modelos;

[Keyless]
[Table("ActividadEconomicaHacienda")]
public class ActividadEconomicaHacienda
{
    [Column("codigo_actividad")]
    public string CodigoActividad { get; set; } = string.Empty;

    [Column("nombre_actividad")]
    public string? Descripcion { get; set; }
    [Column("activo")]
    public bool Activo { get; set; }
}
