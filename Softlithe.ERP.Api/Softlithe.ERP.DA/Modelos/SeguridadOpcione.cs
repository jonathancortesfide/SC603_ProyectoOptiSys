using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Softlithe.ERP.DA.Modelos;

[Keyless]
public partial class SeguridadOpcione
{
    [Column("no_opcion")]
    public int NoOpcion { get; set; }

    [Column("descripcion")]
    [StringLength(50)]
    public string? Descripcion { get; set; }

    [Column("identificador")]
    public int Identificador { get; set; }

    [Column("no_modulo")]
    public int NoModulo { get; set; }
}
