using System;
using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Monedas
{
	public class MonedaSucursalDto
	{
		[Required(ErrorMessage = "El número de moneda es requerido.")]
		public int numeroDeMoneda { get; set; }

		[Required(ErrorMessage = "El identificador de la sucursal es requerido.")]
		public int identificador { get; set; }

		[Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
		public string usuario { get; set; } = string.Empty;
	}
}
