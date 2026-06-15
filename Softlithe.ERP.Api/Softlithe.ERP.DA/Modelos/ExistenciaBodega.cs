using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("ExistenciaBodega")]
public class ExistenciaBodega
{
    [Key]
    [Column("id_existencia_bodega")]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int IdExistenciaBodega { get; set; }

    [Column("no_empresa")]
    public int NoEmpresa { get; set; }

    [Column("id_producto")]
    public int IdProducto { get; set; }

    [Column("no_bodega")]
    public int NoBodega { get; set; }

    [Column("existencia")]
    public decimal Existencia { get; set; }
}
