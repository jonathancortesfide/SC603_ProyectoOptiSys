using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Monedas
{
	public class CambiarEstadoMonedaDto
	{
		public bool activo { get; set; }
		[Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
		public string usuario { get; set; } = string.Empty;
	}
}
