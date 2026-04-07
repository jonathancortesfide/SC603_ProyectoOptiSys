using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Softlithe.ERP.DA.Modelos;

[Table("Enfermedad")]
public partial class Enfermedad
{
    [Key]
    [Column("no_enfermedad")]
    public int NoEnfermedad { get; set; }

    [Column("identificador")]
    public int Identificador { get; set; }

    [Column("id_enfermedad")]
    public int IdEnfermedad { get; set; }

    [Column("activo")]
    public bool Activo { get; set; }
    public virtual ICollection<EnfermedadCatalogo> EnfermedadCatalogo { get; set; } = new List<EnfermedadCatalogo>();
}
