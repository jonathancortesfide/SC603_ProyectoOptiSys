using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Softlithe.ERP.DA.Modelos;

[Keyless]
public partial class SeguridadRolAccione
{
    [Column("no_rol")]
    public int NoRol { get; set; }

    [Column("no_accion")]
    public int NoAccion { get; set; }

    [Column("no_opcion")]
    public int NoOpcion { get; set; }

    [Column("no_modulo")]
    public int NoModulo { get; set; }

    [Column("identificador")]
    public int Identificador { get; set; }
}
