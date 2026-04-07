using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.Autenticacion
{
	public class LoginResponseDto
	{
		public bool esCorrecto { get; set; }
		public string mensaje { get; set; } = string.Empty;
		public LoginDataDto? data { get; set; }
	}

	public class LoginDataDto
	{
		public string token { get; set; } = string.Empty;
		public int noUsuario { get; set; }
		public string nombreUsuario { get; set; } = string.Empty;
		public string correo { get; set; } = string.Empty;
	}
}
