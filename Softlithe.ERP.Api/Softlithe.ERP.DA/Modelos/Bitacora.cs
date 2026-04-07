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
	[Keyless]
	[Table("Bitacora")]
	public class Bitacora
	{
		[Column("no_bitacora")]
		public Guid idBitacora { get; set; }
		[Column("identificador")]
		public int identificador { get; set; }
		[Column("usuario")]
		[MaxLength(100)]
		public string usuario { get; set; }
		[Column("descripcion_evento")]
		public string descripcionDelEvento { get; set; }
		[Column("fecha_registro")]
		public DateTime fechaDeRegistro { get; set; }
		[Column("nombre_metodo")]
		[MaxLength(200)]
		public string nombreDelMetodo { get; set; }
		[Column("tabla")]
		[MaxLength(50)]
		public string tabla { get; set; }
		[Column("mensaje_excepcion")]
		public string mensajeExcepcion { get; set; }
		[Column("stack_trace")]
		public string stackTrace { get; set; }
	}
}
