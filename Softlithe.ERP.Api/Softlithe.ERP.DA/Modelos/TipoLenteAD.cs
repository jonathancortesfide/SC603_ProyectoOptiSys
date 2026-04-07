
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace Softlithe.ERP.DA.Modelos
{
    [Table("TipoLente")]

    public partial class TipoLenteAD
    {
        [Key]
        [Column("no_tipo")]
        public int NoTipo { get; set; }

        [Column("descripcion")]
        [StringLength(100)]
        public string? Descripcion { get; set; }

        [Column("no_empresa")]
        public int NoEmpresa { get; set; }

        [Column("activo")]
        public bool? Activo { get; set; }
    }
}