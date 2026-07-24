using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Examenes;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using System.Threading.Tasks;

namespace Softlithe.ERP.Api.Controllers.Examenes
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExamenSnapshotController : ControllerBase
    {
        private readonly IExamenSnapshotBW _examenSnapshotBW;


        public ExamenSnapshotController(
            IExamenSnapshotBW examenSnapshotBW)
        {
            _examenSnapshotBW = examenSnapshotBW;
        }


        [HttpGet("{noExamen}")]
        public async Task<IActionResult> Obtener(int noExamen)
        {
            var respuesta = await _examenSnapshotBW.ObtenerPorNoExamen(noExamen);

            if (!respuesta.EsCorrecto)
            {
                return BadRequest(respuesta);
            }

            return Ok(respuesta);
        }



        [HttpPost]
        public async Task<IActionResult> Crear(
            [FromBody] ExamenSnapshotDto examenSnapshot)
        {
            var respuesta = await _examenSnapshotBW.Crear(examenSnapshot);

            if (!respuesta.EsCorrecto)
            {
                return BadRequest(respuesta);
            }

            return Ok(respuesta);
        }
    }
}