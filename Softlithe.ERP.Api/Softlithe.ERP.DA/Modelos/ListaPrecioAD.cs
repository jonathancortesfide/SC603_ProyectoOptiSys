using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

    [Table("ListaPrecios")]
    public partial class ListaPrecioAD 
    {
        [Key]
        [Column("no_lista")]
        public int NoLista { get; set; } 

        [Column("descripcion")]
        [StringLength(50)]
        public string? Descripcion { get; set; }

        [Column("id_moneda")]
        public int IdMoneda { get; set; }

        [Column("activo")]
        public bool? Activo { get; set; }
}

