using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Examenes.AgregarExamen;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using Softlithe.ERP.Api.Atributos;

namespace Softlithe.ERP.Api.Controllers
{
	[Authorize]
	[Route("api/[controller]")]
	[ApiController]
	public class ExamenesController : ControllerBase
	{
		private readonly IAgregarExamenBW _agregarExamenBW;

		public ExamenesController(IAgregarExamenBW agregarExamenBW)
		{
			_agregarExamenBW = agregarExamenBW;
		}

		[RequierePermiso("EXAMEN_CREAR")]
		[HttpPost("AgregarExamen")]
		public async Task<ModeloValidacion> AgregarExamen(AgregarExamenDto datos)
		{
			ModeloValidacion elModeloDeValidacion = await _agregarExamenBW.Agregar(datos);
			return elModeloDeValidacion;
		}
        [RequierePermiso("EXAMEN_VER")]
        [HttpGet("ObtenerProximoNumeroExamen/{identificador}")]
        public async Task<int> ObtenerProximoNumeroExamen([FromRoute] int identificador)
        {
            int resultado = await _agregarExamenBW.ObtenerProximoNumeroExamen(identificador);
            return resultado;
        }
    }
}
