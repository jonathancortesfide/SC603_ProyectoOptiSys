using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Examenes.AgregarExamen
{
	public interface IAgregarExamenBW
	{
		Task<ModeloValidacion> Agregar(AgregarExamenDto datos);
	}
}
