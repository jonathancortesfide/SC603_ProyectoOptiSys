using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Softlithe.ERP.DA.Modelos;

[Table("EnfermedadCatalogo")]
public partial class EnfermedadCatalogo
{
    [Key]
    [Column("id_enfermedad")]
    public int IdEnfermedad { get; set; }

    [Column("descripcion")]
    [StringLength(100)]
    [Unicode(false)]
    public string Descripcion { get; set; } = null!;

    [Column("no_tipo")]
    public int NoTipo { get; set; }

    [ForeignKey(nameof(NoTipo))]
    public virtual EnfermedadTipo? EnfermedadTipo { get; set; }
}
