using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Enfermedades
{
	public class CambiarEstadoEnfermedadDto
	{
		public bool activo { get; set; }
		[Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
		public string usuario { get; set; } = string.Empty;
	}
}
