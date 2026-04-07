using Microsoft.Extensions.Configuration;
using Softlithe.ERP.Abstracciones.BW.Generales.Fecha;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Generales.Fecha
{
	public class GestionDeFecha: IGestionDeFecha
	{
		private readonly IConfiguration _configuration;
		public GestionDeFecha(IConfiguration configuration)
		{
			_configuration = configuration;
		}
		public DateTime ObtenerFechaActual()
		{
			int zonaHoraria = int.Parse(_configuration["VariablesGenerales:ZonaHoraria"] ?? "0");
			return DateTime.Now;
		}	
	}
}
