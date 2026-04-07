using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Softlithe.ERP.DA.Modelos;

[Table("Marca")]
public partial class Marca
{
    [Key]
    [Column("no_marca")]
    public int NoMarca { get; set; }

    [Column("descripcion")]
    [StringLength(100)]
    [Unicode(false)]
    public string? Descripcion { get; set; }

    [Column("no_empresa")]
    public int NoEmpresa { get; set; }

    [Column("es_activo")]
    public bool EsActivo { get; set; }
}
