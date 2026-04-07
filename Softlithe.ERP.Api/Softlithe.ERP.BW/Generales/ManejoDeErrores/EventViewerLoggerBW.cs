using Microsoft.Extensions.Configuration;
using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Generales.ManejoDeErrores
{
	public class EventViewerLoggerBW: IInternalErrorLogger
	{
		IConfiguration _configurationManager;
		public EventViewerLoggerBW(IConfiguration configurationManager)
		{
			_configurationManager = configurationManager;
		}
		public async Task RegistrarEventoError(Exception ex)
		{
			await Task.Run(() =>
			{
				string source = _configurationManager.GetValue<string>("Logging:SourceName");
				string log = _configurationManager.GetValue<string>("Logging:LogName");
				string eventMessage = $"Se ha producido un error no controlado en la aplicación.\n" +
									  $"Mensaje general: {ex.Message}\n" +
									  $"Mensaje Inner: {ex.InnerException?.Message}\n" +
									  $"Nombre del método: {ex.TargetSite?.Name ?? "Desconocido"}\n" +
									  $"StackTrace: {ex.StackTrace ?? "No disponible"}";
				if (!System.Diagnostics.EventLog.SourceExists(source))
				{
					System.Diagnostics.EventLog.CreateEventSource(source, log);
				}
				System.Diagnostics.EventLog.WriteEntry(source, eventMessage, System.Diagnostics.EventLogEntryType.Error);
			});
		}
	}
}
