using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Examenes;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using Softlithe.ERP.Abstracciones.Contenedores;

namespace Softlithe.ERP.Api.Controllers
{
    /// <summary>
    /// Controlador encargado de gestionar las operaciones relacionadas con los Tipos de Lente.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ExamenCompletoController : ControllerBase
    {
        private readonly IObtenerExamenCompletoBW _obtenerExamenCompletoBW;

        public ExamenCompletoController(IObtenerExamenCompletoBW obtenerExamenCompletoBW)
        { 
            _obtenerExamenCompletoBW = obtenerExamenCompletoBW;
        }

        /// <summary>
        /// Obtiene los exámenes completos asociados a un paciente.
        /// </summary>
        /// <remarks>
        /// Devuelve la lista de exámenes de graduación registrados para el número
        /// de paciente proporcionado.
        /// </remarks>
        /// <param name="noPaciente">
        /// Número identificador del paciente.
        /// </param>
        /// <returns>
        /// Un objeto <see cref="ModeloValidacionConDatos{T}"/> que contiene
        /// la lista de exámenes y el resultado de la validación.
        /// </returns>
        /// <response code="200">
        /// Operación exitosa. Retorna los exámenes del paciente.
        /// </response>
        /// <response code="500">
        /// Error interno del servidor.
        /// </response>
        [HttpPost("ObtenerPorNoPaciente")]
        public async Task<ModeloValidacionConDatos<System.Collections.Generic.List<ExamenGraduacionDto>>> ObtenerPorNoPaciente(int noPaciente)
        {
            var resultado = await _obtenerExamenCompletoBW.ObtenerPorNoPaciente(noPaciente);
            return resultado;
        }

        [HttpPost("ObtenerPorNumeroExamen")]
        public async Task<ModeloValidacionConDatos<System.Collections.Generic.List<ExamenGraduacionDto>>> ObtenerPorNumeroExamen(int noExamen)
        {
            var resultado = await _obtenerExamenCompletoBW.ObtenerPorNumeroExamen(noExamen);
            return resultado;
        }

        [HttpPost("ObtenerPorCriterios")]
        public async Task<ModeloValidacionConDatos<System.Collections.Generic.List<ExamenGraduacionDto>>> ObtenerPorCriterios(int? noExamen, int? noPaciente)
        {
            var resultado = await _obtenerExamenCompletoBW.ObtenerPorCriterios(noExamen, noPaciente);
            return resultado;
        }
    }
}
