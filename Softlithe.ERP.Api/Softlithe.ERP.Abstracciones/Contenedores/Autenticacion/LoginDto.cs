using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.Autenticacion
{
	public class LoginDto
	{
		public string nombreUsuario { get; set; } = string.Empty;
		public string contraseña { get; set; } = string.Empty;
	}
}
