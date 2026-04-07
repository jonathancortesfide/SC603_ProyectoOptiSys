using Softlithe.ERP.Abstracciones.Contenedores.Monedas;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Monedas.BorrarMoneda
{
	public interface IBorrarMonedasDA
	{
		Task<int> BorrarMoneda(MonedaDto monedaDto);
	}
}
