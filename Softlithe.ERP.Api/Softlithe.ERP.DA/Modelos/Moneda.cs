using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Modelos
{
	[Table("Moneda")]
	public class Moneda
	{
		[Column("no_moneda")]
		[Key]
		public int numeroDeMoneda { get; set; }
		[Column("descripcion")]
		public string descripcion { get; set; }
		[Column("signo")]
		public string signo { get; set; }
		[Column("url")]
		public string url { get; set; }
	}
}
