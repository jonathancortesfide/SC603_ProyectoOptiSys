using Microsoft.Extensions.Configuration;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Generales.ManejoDeErrores
{
	public class FileEventLoggerBW: IInternalErrorLogger
	{
		IConfiguration _configurationManager;
		public FileEventLoggerBW(IConfiguration configurationManager) { 
			_configurationManager = configurationManager;
		}
		public async Task RegistrarEventoError(Exception ex)
		{
			await Task.Run(() =>
			{
				string directoryPath = _configurationManager.GetValue<string>("Loggers:path");
				string nameFile = _configurationManager.GetValue<string>("Loggers:nameFileLog");
				string filePath = System.IO.Path.Combine(directoryPath, nameFile);

				// Crear el directorio si no existe
				if (!System.IO.Directory.Exists(directoryPath))
				{
					System.IO.Directory.CreateDirectory(directoryPath);
				}

				// Crear el archivo si no existe
				if (!System.IO.File.Exists(filePath))
				{
					using (System.IO.File.Create(filePath)) { }
				}

				string eventMessage = $"[{DateTime.Now}] Se ha producido un error no controlado en la aplicación.\n" +
									  $"Mensaje general: {ex.Message}\n" +
									  $"Mensaje Inner: {ex.InnerException?.Message}\n" +
									  $"Nombre del método: {ex.TargetSite?.Name ?? "Desconocido"}\n" +
									  $"StackTrace: {ex.StackTrace ?? "No disponible"}\n" +
									  $"--------------------------------------------------\n";
				System.IO.File.AppendAllText(filePath, eventMessage);
			});
		}
	}
}
