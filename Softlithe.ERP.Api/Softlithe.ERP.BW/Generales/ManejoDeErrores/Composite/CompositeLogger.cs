using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Generales.ManejoDeErrores.Composite
{
	public class CompositeLogger : IErrorLogger
	{
		private readonly IEnumerable<IInternalErrorLogger> _loggers;

		public CompositeLogger(
			IConfiguration configuration,
			IEnumerable<IInternalErrorLogger> loggers)
		{
			_loggers = FiltrarLoggers(configuration, loggers);
		}

		private IEnumerable<IInternalErrorLogger> FiltrarLoggers(
			IConfiguration configuration,
			IEnumerable<IInternalErrorLogger> loggers)
		{
			foreach (IInternalErrorLogger logger in loggers)
			{
				if (logger is BaseDeDatosLoggerBW && !configuration.GetValue<bool>("Loggers:BaseDatosLogger"))
					continue;
				if (logger is EventViewerLoggerBW && !configuration.GetValue<bool>("Loggers:EventViewerLogger"))
					continue;
				if (logger is FileEventLoggerBW && !configuration.GetValue<bool>("Loggers:FileEventLoggerBW"))
					continue;

				yield return logger;
			}
		}

		public async Task RegistrarEventoError(Exception ex)
		{
			foreach (IInternalErrorLogger logger in _loggers)
			{ await logger.RegistrarEventoError(ex); }
		}
	}

}
