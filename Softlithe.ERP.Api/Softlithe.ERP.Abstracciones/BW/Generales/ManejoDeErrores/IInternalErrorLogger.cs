using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores
{
	public interface IInternalErrorLogger
	{
		Task RegistrarEventoError(Exception ex);
	}
}
