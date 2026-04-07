using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos
{
	[Table("MonedaSucursal")]
	public class MonedaSucursal
	{
		[Column("id_moneda")]
		[Key]
		public int idMoneda { get; set; }

		[Column("identificador")]
		public int identificador { get; set; }

		[Column("no_moneda")]
		[ForeignKey(nameof(Moneda))]
		public int numeroDeMoneda { get; set; }

		[Column("activo")]
		public bool activo { get; set; } = true;

		public virtual Moneda Moneda { get; set; }
	}
}
