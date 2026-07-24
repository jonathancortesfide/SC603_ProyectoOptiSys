using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Modelos
{
    [Table("TipoGraduacion")]
    public class TipoGraduacionAD
    {
        [Key]
        [Column("id_tipo_graduacion")]
        public short IdTipoGraduacion { get; set; }

        [Column("nombre")]
        public string? NombreTipoGraduacion { get; set; }
    }

}