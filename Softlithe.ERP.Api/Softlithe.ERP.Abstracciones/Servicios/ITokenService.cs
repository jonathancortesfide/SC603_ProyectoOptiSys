using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Servicios
{
	public interface ITokenService
	{
		string GenerarToken(int noUsuario, string nombreUsuario, string correo);
	}
}
