using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Generales.ManejoDeErrores
{
	public class BaseDeDatosLoggerBW: IInternalErrorLogger
	{
		private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;

		public BaseDeDatosLoggerBW(IAgregarEventoBitacoraBW agregarEventoBitacoraBW)
		{
			_agregarEventoBitacoraBW = agregarEventoBitacoraBW;
		}
		public async Task RegistrarEventoError(Exception ex)
		{
			string descripcionDelEvento = "Se ha producido un error no controlado en la aplicación.";
			string mensajeExcepcion = "Mensaje general: " + ex.Message + ". Mensaje Inner: " + ex.InnerException?.InnerException?.Message;
			string nombreDelMetodo = ex.TargetSite?.Name ?? "Desconocido";
			string stackTrace = ex.StackTrace ?? "No disponible";
			string tabla = "N/A";
			BitacoraDto bitacoraDto = _agregarEventoBitacoraBW.ConstruirObjetoBitacora(descripcionDelEvento, "", 1, mensajeExcepcion, nombreDelMetodo, stackTrace, tabla);
			await _agregarEventoBitacoraBW.AgregarEventoBitacora(bitacoraDto);
		}
	}
}
