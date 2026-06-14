using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.ActividadEconomicaHacienda;
using Softlithe.ERP.Abstracciones.Contenedores.ActividadEconomicaHacienda;

namespace Softlithe.ERP.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActividadEconomicaHaciendaController : ControllerBase
    {
        private readonly IObtenerActividadEconomicaHaciendaBW _obtenerActividadEconomicaHaciendaBW;

        public ActividadEconomicaHaciendaController(IObtenerActividadEconomicaHaciendaBW obtenerActividadEconomicaHaciendaBW)
        {
            _obtenerActividadEconomicaHaciendaBW = obtenerActividadEconomicaHaciendaBW;
        }

        /// <summary>
        /// Obtiene el catálogo de actividades económicas de Hacienda (codigo_actividad, descripcion).
        /// Sin <paramref name="textoBusqueda"/> devuelve todas las activas; con texto filtra por código o nombre (contiene).
        /// </summary>
        [HttpGet("ObtenerActividadEconomicaHacienda")]
        public async Task<ActividadEcoHaciendaConModeloDeValidacion> ObtenerActividadEconomicaHacienda([FromQuery] string? textoBusqueda = null)
        {
            return await _obtenerActividadEconomicaHaciendaBW.ObtenerActividadEconomicaHacienda(textoBusqueda);
        }
    }
}
