using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.Autenticacion
{
	public class UsuarioDto
	{
		public int noUsuario { get; set; }
		public string nombreUsuario { get; set; } = string.Empty;
		public string correo { get; set; } = string.Empty;
		public string contraseña { get; set; } = string.Empty;
		public bool esActivo { get; set; }
		public DateTime fechaCreacion { get; set; }
		public DateTime? fechaModificacion { get; set; }
	}
}
