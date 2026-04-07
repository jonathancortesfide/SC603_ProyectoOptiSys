using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Enfermedades
{
	public class EnfermedadDto
	{
		public int idEnfermedad { get; set; }
		public int identificador { get; set; }
		[Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
		public string usuario { get; set; } = string.Empty;
	}
}
