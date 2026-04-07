using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.ListaPrecio.AgregarListaPrecio;
using Softlithe.ERP.Abstracciones.BW.ListaPrecio.ModificarEstadoListaPrecio;
using Softlithe.ERP.Abstracciones.BW.ListaPrecio.ModificarListaPrecio;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.ListaPrecio;
using Softlithe.ERP.Abstracciones.Contenedores.TipoLente;
using Softlithe.ERP.Abstracciones.DA.ListaPrecio;

namespace Softlithe.ERP.Api.Controllers
{
    /// <summary>
    /// Controlador encargado de gestionar las operaciones relacionadas con las Listas de Precio.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class ListaPrecioController : ControllerBase
    {
        private readonly IAgregarListaPrecioBW _agregarListaPrecio;
        private readonly IModificarListaPrecioBW _modificarListaPrecio;
        private readonly IObtenerListaPrecioPorIdBW _obtenerListaPrecioPorId;
        private readonly IModificarEstadoListaPrecioBW _modificarEstadoListaPrecio;

        public ListaPrecioController(
            IAgregarListaPrecioBW agregarListaPrecio,
            IModificarListaPrecioBW modificarListaPrecio,
            IObtenerListaPrecioPorIdBW obtenerListaPrecioPorId,
            IModificarEstadoListaPrecioBW modificarEstadoListaPrecio)
        {
            _agregarListaPrecio = agregarListaPrecio;
            _modificarListaPrecio = modificarListaPrecio;
            _obtenerListaPrecioPorId = obtenerListaPrecioPorId;
            _modificarEstadoListaPrecio = modificarEstadoListaPrecio;
        }

        // POST: api/ListaPrecio/Obtener
        /// <summary>
        /// Obtiene las listas de precio asociadas a una moneda.
        /// </summary>
        /// <remarks>
        /// Devuelve las listas de precio registradas en el sistema según el identificador de la moneda.
        /// </remarks>
        /// <param name="id_moneda">Identificador de la moneda asociada a la lista de precios.</param>
        /// <returns>
        /// Un objeto <see cref="ListaPrecioConModeloDeValidacion"/> que contiene la lista de precios
        /// y el estado de la validación de la operación.
        /// </returns>
        /// <response code="200">Operación exitosa. Retorna las listas de precio.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpPost("Obtener")]
        public async Task<ListaPrecioConModeloDeValidacion> Obtener(int id_moneda)
        {
            // Obtener el resultado completo del método, que ya es ListaPrecioConModeloDeValidacion
            var resultado = await _obtenerListaPrecioPorId.Obtener(id_moneda);
            return resultado;
        }

        // POST: api/ListaPrecio/Agregar
        /// <summary>
        /// Agrega una nueva lista de precios al sistema.
        /// </summary>
        /// <remarks>
        /// Registra una lista de precios con su descripción y moneda asociada.
        /// </remarks>
        /// <param name="listaPrecioDto">Objeto que contiene la información de la lista de precios.</param>
        /// <returns>
        /// Un objeto <see cref="ModeloValidacion"/> que indica si la operación fue exitosa.
        /// </returns>
        /// <response code="200">Lista de precios agregada correctamente.</response>
        /// <response code="400">Los datos enviados no son válidos.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpPost("Agregar")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ModeloValidacion), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Agregar([FromBody] ListaPrecioDto listaPrecioDto)
        {
            if (listaPrecioDto == null)
            {
                return BadRequest(new ModeloValidacion
                {
                    Mensaje = "Datos inválidos",
                    EsCorrecto = false
                });
            }

            var resultado = await _agregarListaPrecio.Agregar(listaPrecioDto);

            return Ok(resultado);
        }

        // PUT: api/ListaPrecio/Modificar
        /// <summary>
        /// Modifica la información de una lista de precios existente.
        /// </summary>
        /// <remarks>
        /// Permite actualizar los datos de una lista de precios registrada en el sistema.
        /// </remarks>
        /// <param name="laListaPrecio">Objeto que contiene los datos actualizados de la lista de precios.</param>
        /// <returns>
        /// Un objeto <see cref="ModeloValidacion"/> que indica si la operación fue exitosa.
        /// </returns>
        /// <response code="200">Lista de precios modificada correctamente.</response>
        /// <response code="400">Los datos enviados no son válidos.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpPut("Modificar")]
        public async Task<ModeloValidacion> Modificar([FromBody] ListaPrecioDto laListaPrecio)
        {
            return await _modificarListaPrecio.ModificarListaPrecio(laListaPrecio);
        }

        // PUT: api/ListaPrecio/ModificarEstado
        /// <summary>
        /// Modifica el estado (activo/inactivo) de una lista de precios.
        /// </summary>
        /// <remarks>
        /// Permite cambiar el estado de una lista de precios entre activa e inactiva.
        /// </remarks>
        /// <param name="noLista">Identificador de la lista de precios.</param>
        /// <param name="activo">Estado de la lista (true para activo, false para inactivo).</param>
        /// <returns>
        /// Un objeto <see cref="ModeloValidacion"/> que indica si la operación fue exitosa.
        /// </returns>
        /// <response code="200">Estado de la lista modificado correctamente.</response>
        /// <response code="400">Los datos enviados no son válidos.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpPut("ModificarEstado/{noLista}/{activo}")]
        [Produces("application/json")]
        [ProducesResponseType(typeof(ModeloValidacion), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ModificarEstado(int noLista, bool activo)
        {
            if (noLista <= 0)
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
                var resultado = await _modificarEstadoListaPrecio.ModificarEstadoListaPrecio(noLista, activo);
                
                if (resultado == 0)
                {
                    return BadRequest(new ModeloValidacion
                    {
                        Mensaje = "La lista de precios no existe.",
                        EsCorrecto = false
                    });
                }

                return Ok(new ModeloValidacion
                {
                    Mensaje = "Estado de la lista de precios modificado correctamente.",
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