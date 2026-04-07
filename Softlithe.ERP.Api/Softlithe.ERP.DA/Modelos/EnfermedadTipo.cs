using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos
{
	[Table("EnfermedadTipo")]
	public class EnfermedadTipo
	{
		[Column("no_tipo")]
		[Key]
		public int NumeroTipo { get; set; }

		[Column("nombre")]
		[Required]
		public string Nombre { get; set; } = string.Empty;
	}
}
