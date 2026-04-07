using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.ConexionALaBaseDeDatos
{
	public interface IConexionABaseDeDatos
	{
		string? ObtenerCadenaDeConexion();
	}
}
