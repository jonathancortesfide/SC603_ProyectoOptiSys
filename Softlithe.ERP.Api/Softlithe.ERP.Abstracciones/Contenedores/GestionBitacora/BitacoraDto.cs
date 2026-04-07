using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora
{
	public class BitacoraDto
	{
		public Guid idBitacora { get; set; }
		public int identificador { get; set; }
		[MaxLength(100)]
		public string usuario { get; set; }
		public string descripcionDelEvento { get; set; }
		public DateTime fechaDeRegistro { get; set; }
		[MaxLength(200)]
		public string nombreDelMetodo { get; set; }
		[MaxLength(50)]
		public string tabla { get; set; }
		public string mensajeExcepcion { get; set; }
		public string stackTrace { get; set; }
	}
}
