using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos
{
	[Table("Enfermedad")]
	public class EnfermedadSucursal
	{
		[Column("no_enfermedad")]
		[Key]
		public int numeroEnfermedad { get; set; }

		[Column("identificador")]
		public int identificador { get; set; }

		[Column("id_enfermedad")]
		[ForeignKey(nameof(EnfermedadCatalogo))]
		public int idEnfermedad { get; set; }

		[Column("activo")]
		public bool activo { get; set; } = true;
		public virtual EnfermedadCatalogo EnfermedadCatalogo { get; set; }
    }
}
