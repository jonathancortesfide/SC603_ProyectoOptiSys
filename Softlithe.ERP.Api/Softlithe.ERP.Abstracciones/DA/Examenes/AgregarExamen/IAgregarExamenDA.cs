using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Examenes.AgregarExamen
{
	public interface IAgregarExamenDA
	{
		Task<int> Agregar(AgregarExamenDto datos);
	}
}
