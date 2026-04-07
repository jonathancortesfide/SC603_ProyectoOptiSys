using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.TipoLente;
using Softlithe.ERP.Abstracciones.BW.TipoLente.AgregarTipoLente;
using Softlithe.ERP.Abstracciones.BW.TipoLente.ModificarEstadoTipoLente;
using Softlithe.ERP.Abstracciones.BW.TipoLente.ModificarTipoLente;
using Softlithe.ERP.Abstracciones.BW.TipoLente.ObtenerTipoLentePorId;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.TipoLente;
using Softlithe.ERP.BW.TipoLente.ModificarEstadoTipoLente;

namespace Softlithe.ERP.Api.Controllers
{
    /// <summary>
    /// Controlador encargado de gestionar las operaciones relacionadas con los Tipos de Lente.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class TipoLenteController : ControllerBase
    {
        private readonly IObtenerTipoLentesPorIdBW _obtenerTipoLentePorId;
        private readonly IAgregarTipoLenteBW _agregarTipoLente;
        private readonly IModificarTipoLenteBW _modificarTipoLente;
        private readonly IModificarEstadoTipoLenteBW _modificarEstadoTipoLente;
     

        public TipoLenteController(
            IObtenerTipoLentesPorIdBW obtenerTipoLentePorId,
            IAgregarTipoLenteBW agregarTipoLente,
            IModificarTipoLenteBW modificarTipoLente,
            IModificarEstadoTipoLenteBW modificarEstadoTipoLente)
        {
            _obtenerTipoLentePorId = obtenerTipoLentePorId;
            _agregarTipoLente = agregarTipoLente;
            _modificarTipoLente = modificarTipoLente;
            _modificarEstadoTipoLente = modificarEstadoTipoLente;
        }

        // POST: api/TipoLente/Obtener
        /// <summary>
        /// Obtiene un tipo de lente según su identificador.
        /// </summary>
        /// <remarks>
        /// Devuelve la información del tipo de lente asociado al identificador proporcionado.
        /// </remarks>
        /// <param name="id_tipo_lente">Identificador único del tipo de lente.</param>
        /// <returns>
        /// Un objeto <see cref="TipoLenteConModeloDeValidacion"/> que contiene la lista de tipos de lente
        /// y el estado de la validación de la operación.
        /// </returns>
        /// <response code="200">Operación exitosa. Retorna la información del tipo de lente.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpPost("Obtener")]
        public async Task<TipoLenteConModeloDeValidacion> Obtener(int no_empresa)
        {
            var resultado = new TipoLenteConModeloDeValidacion
            {
                EsCorrecto = true,
                Mensaje = ""
            };

            resultado.TipoDeLente = await _obtenerTipoLentePorId.Obtener(no_empresa);

            return resultado;
        }

        // POST: api/TipoLente/Agregar
        /// <summary>
        /// Agrega un nuevo tipo de lente al sistema.
        /// </summary>
        /// <remarks>
        /// Recibe los datos del tipo de lente y lo registra en el sistema.
        /// </remarks>
        /// <param name="tipoLente">Objeto que contiene la información del tipo de lente a registrar.</param>
        /// <returns>
        /// Un objeto <see cref="ModeloValidacion"/> que indica si la operación fue exitosa.
        /// </returns>
        /// <response code="200">Tipo de lente agregado correctamente.</response>
        /// <response code="400">Los datos enviados no son válidos.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpPost("Agregar")]
        public async Task<ModeloValidacion> Agregar([FromBody] TipoLenteDto tipoLente)
        {
            return await _agregarTipoLente.Agregar(tipoLente);
        }

        // PUT: api/TipoLente/Modificar
        /// <summary>
        /// Modifica la información de un tipo de lente existente.
        /// </summary>
        /// <remarks>
        /// Permite actualizar los datos de un tipo de lente previamente registrado.
        /// </remarks>
        /// <param name="tipoLente">Objeto que contiene la información actualizada del tipo de lente.</param>
        /// <returns>
        /// Un objeto <see cref="ModeloValidacion"/> que indica si la operación fue exitosa.
        /// </returns>
        /// <response code="200">Tipo de lente modificado correctamente.</response>
        /// <response code="400">Los datos enviados no son válidos.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpPut("Modificar")]
        public async Task<ModeloValidacion> Modificar([FromBody] TipoLenteDto tipoLente)
        {
            return await _modificarTipoLente.ModificarTipoLente(tipoLente);
        }

        // PUT: api/TipoLente/ModificarEstado
        /// <summary>
        /// Modifica el estado (activo/inactivo) de un tipo de lente.
        /// </summary>
        /// <remarks>
        /// Permite cambiar el estado de un tipo de lente entre activo e inactivo.
        /// </remarks>
        /// <param name="noTipoLente">Identificador del tipo de lente.</param>
        /// <param name="activo">Estado del tipo de lente (true para activo, false para inactivo).</param>
        /// <returns>
        /// Un objeto <see cref="ModeloValidacion"/> que indica si la operación fue exitosa.
        /// </returns>
        /// <response code="200">Estado del tipo de lente modificado correctamente.</response>
        /// <response code="400">Los datos enviados no son válidos.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpPut("ModificarEstado/{noTipoLente}/{activo}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ModeloValidacion), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ModificarEstado(int noTipoLente, bool activo)
        {
            if (noTipoLente <= 0)
            {
                return BadRequest(new ModeloValidacion
                {
                    Mensaje = "Datos inválidos. El identificador debe ser mayor a 0.",
                    EsCorrecto = false
                });
            }

            try
            {
                int activoInt = activo ? 1 : 0;
                var resultado = await _modificarEstadoTipoLente.ModificarEstadoTipoLente(noTipoLente, activo);
                
                if (resultado == 0)
                {
                    return BadRequest(new ModeloValidacion
                    {
                        Mensaje = "El tipo de lente no existe.",
                        EsCorrecto = false
                    });
                }

                return Ok(new ModeloValidacion
                {
                    Mensaje = "Estado del tipo de lente modificado correctamente.",
                    EsCorrecto = true
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ModeloValidacion
                {
                    Mensaje = $"Error al modificar el estado: {ex.Message}",
                    EsCorrecto = false
                });
            }
        }
    }
}