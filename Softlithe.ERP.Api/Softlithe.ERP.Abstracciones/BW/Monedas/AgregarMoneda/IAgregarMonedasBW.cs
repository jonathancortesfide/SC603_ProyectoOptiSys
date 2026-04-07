using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Monedas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Monedas.AgregarMoneda
{
	public interface IAgregarMonedasBW
	{
		Task<ModeloValidacion> AgregarMoneda(MonedaDto monedaDto);
	}
}
