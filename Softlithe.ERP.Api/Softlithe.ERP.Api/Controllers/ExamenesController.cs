using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Examenes.AgregarExamen;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;

namespace Softlithe.ERP.Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class ExamenesController : ControllerBase
	{
		private readonly IAgregarExamenBW _agregarExamenBW;

		public ExamenesController(IAgregarExamenBW agregarExamenBW)
		{
			_agregarExamenBW = agregarExamenBW;
		}

		[HttpPost("AgregarExamen")]
		public async Task<ModeloValidacion> AgregarExamen(AgregarExamenDto datos)
		{
			ModeloValidacion elModeloDeValidacion = await _agregarExamenBW.Agregar(datos);
			return elModeloDeValidacion;
		}
        [HttpGet("ObtenerProximoNumeroExamen/{identificador}")]
        public async Task<int> ObtenerProximoNumeroExamen([FromRoute] int identificador)
        {
            int resultado = await _agregarExamenBW.ObtenerProximoNumeroExamen(identificador);
            return resultado;
        }
    }
}
