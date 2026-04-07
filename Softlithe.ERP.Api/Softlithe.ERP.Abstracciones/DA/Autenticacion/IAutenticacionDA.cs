using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Autenticacion
{
	public interface IAutenticacionDA
	{
		Task<(bool esValido, int noUsuario, string nombreUsuario, string correo)> ValidarCredenciales(string nombreUsuario, string contraseña);
	}
}
