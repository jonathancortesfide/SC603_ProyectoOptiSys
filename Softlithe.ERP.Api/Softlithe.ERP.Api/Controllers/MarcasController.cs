using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Marcas;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Marcas;

namespace Softlithe.ERP.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MarcasController : ControllerBase
    {
        private readonly IObtenerMarcaBW _obtenerMarcaBW;
        private readonly IAgregarMarcaBW _agregarMarcaBW;
        private readonly IModificarMarcaBW _modificarMarcaBW;
        private readonly IModificarEstadoMarcaBW _modificarEstadoMarcaBW;
        public MarcasController(IObtenerMarcaBW obtenerMarcaBW, IAgregarMarcaBW agregarMarcaBW, IModificarMarcaBW modificarMarcaBW, IModificarEstadoMarcaBW modificarEstadoMarcaBW)
        {
            _obtenerMarcaBW = obtenerMarcaBW;
            _agregarMarcaBW = agregarMarcaBW;
            _modificarMarcaBW = modificarMarcaBW;
            _modificarEstadoMarcaBW = modificarEstadoMarcaBW;
        }
        // POST: api/Marcas/ObtenerMarca
        /// <summary>
        /// Obtiene todas las Marcas disponibles en el sistema.
        /// </summary>
        /// <remarks>
        /// Devuelve una lista de Marcas junto con el modelo de validación.
        /// </remarks>
        /// <returns>Un objeto <see cref="MarcaConModeloDeValidacion"/> que contiene la lista de Marcas y el estado de la validación.</returns>
        /// <response code="200">Operación exitosa. Retorna la lista de Marcas.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpPost("ObtenerMarca")]
        public async Task<MarcaConModeloDeValidacion> ObtenerMarca(ParametroConsultaMarca parametroConsultaMarca)
        {
            MarcaConModeloDeValidacion laListaDeMarcas = await _obtenerMarcaBW.ObtenerMarcas(parametroConsultaMarca);
            return laListaDeMarcas;
        }
        // POST: api/Marcas/AgregarMarca
        /// <summary>
        /// Inserta una marca en la base de datos.
        /// </summary>
        /// <remarks>
        /// Devuelve un modelo de validación para establecer si guardo la marca o no.
        /// </remarks>
        /// <returns>Un objeto <see cref="ModeloValidacion"/> que contiene el estado de la validación.</returns>
        /// <response code="200">Operación exitosa. Retorna un modelo de validación.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpPost("AgregarMarca")]
        public async Task<ModeloValidacion> AgregarMarca(MarcaDto parametroMarca)
        {
            ModeloValidacion resultadoModeloValidacion = await _agregarMarcaBW.AgregarMarca(parametroMarca);
            return resultadoModeloValidacion;
        }
        // POST: api/Marcas/ModificarMarca
        /// <summary>
        /// Inserta una marca en la base de datos.
        /// </summary>
        /// <remarks>
        /// Devuelve un modelo de validación para establecer si guardo la marca o no.
        /// </remarks>
        /// <returns>Un objeto <see cref="ModeloValidacion"/> que contiene el estado de la validación.</returns>
        /// <response code="200">Operación exitosa. Retorna un modelo de validación.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpPost("ModificarMarca")]
        public async Task<ModeloValidacion> ModificarMarca(MarcaDto parametroMarca)
        {
            ModeloValidacion resultadoModeloValidacion = await _modificarMarcaBW.ModificarMarca(parametroMarca);
            return resultadoModeloValidacion;
        }
        // POST: api/Marcas/ModificarEstadoMarca
        /// <summary>
        /// Activa o inactiva una marca en la base de datos.
        /// </summary>
        /// <remarks>
        /// Devuelve un modelo de validación para establecer si cambio su estado o no.
        /// </remarks>
        /// <returns>Un objeto <see cref="ModeloValidacion"/> que contiene el estado de la validación.</returns>
        /// <response code="200">Operación exitosa. Retorna un modelo de validación.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpPost("ModificaEstadoMarca")]
        public async Task<ModeloValidacion> ModificaEstadoMarca(MarcaInActivaDto parametroMarca)
        {
            ModeloValidacion resultadoModeloValidacion = await _modificarEstadoMarcaBW.ModificaEstadoMarca(parametroMarca);
            return resultadoModeloValidacion;
        }
    }
}
