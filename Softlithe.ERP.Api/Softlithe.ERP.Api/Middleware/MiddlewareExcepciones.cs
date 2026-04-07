using Microsoft.Extensions.Logging;
using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;

namespace Softlithe.ERP.Api.Middleware
{
    public class MiddlewareExcepciones
    {
        private readonly RequestDelegate _next;
		public MiddlewareExcepciones(RequestDelegate next)
        {
            _next = next ?? throw new ArgumentNullException(nameof(next));
		}

        public async Task Invoke(HttpContext context, IErrorLogger _logger)
        {
			try
            {
                await _next(context);
            }
			catch (Exception ex)
            {
				await _logger.RegistrarEventoError(ex);
                await context.Response.WriteAsync(ex.ToString());// se agrego unicamnetes para testeo 
                throw new Exception("Ocurrió un error inesperado, intente nuevamente, o comuníquese con el encargado");
            }
        }
    }

    public static class MiddlewareExcepcionExtensiones
    {
        public static IApplicationBuilder UseMiddlewareExcepciones(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<MiddlewareExcepciones>();
        }
    }
}
