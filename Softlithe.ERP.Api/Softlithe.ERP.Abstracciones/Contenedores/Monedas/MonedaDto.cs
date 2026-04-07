using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Monedas
{
	public class MonedaDto
	{
		public int numeroDeMoneda { get; set; }
		public string descripcion { get; set; } = string.Empty;
		public string signo { get; set; } = string.Empty;
		public int identificador { get; set; }
		public string url { get; set; } = string.Empty;
		public bool activo { get; set; }
		[Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
		public string usuario { get; set; } = string.Empty;
	}

	public class MonedaConModeloDeValidacion: ModeloValidacion
	{
		public List<MonedaDto> laListaDeMonedas { get; set; } = new List<MonedaDto>();
	}
}
