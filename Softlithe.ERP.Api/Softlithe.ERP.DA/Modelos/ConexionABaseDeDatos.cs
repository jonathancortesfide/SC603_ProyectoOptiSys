using Microsoft.Extensions.Configuration;
using Softlithe.ERP.Abstracciones.DA.ConexionALaBaseDeDatos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Modelos
{
	public class ConexionABaseDeDatos : IConexionABaseDeDatos
	{
		private IConfiguration _configuration;
		public ConexionABaseDeDatos(IConfiguration configuration)
		{
			_configuration = configuration;
		}

		public string? ObtenerCadenaDeConexion()
		{
			return _configuration.GetConnectionString("DataBase");
		}
	}
}
