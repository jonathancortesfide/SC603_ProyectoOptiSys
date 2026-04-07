using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Softlithe.ERP.DA.Modelos;

[Keyless]
[Table("SeguridadRolesUsuario")]
public partial class SeguridadRolesUsuario
{
    [Column("login")]
    [StringLength(15)]
    public string Login { get; set; } = null!;

    [Column("no_rol")]
    public int NoRol { get; set; }

    [Column("identificador")]
    public int Identificador { get; set; }
}
