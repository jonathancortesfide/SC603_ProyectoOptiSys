using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Proveedores;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Proveedores;

namespace Softlithe.ERP.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProveedoresController : ControllerBase
    {
        private readonly IObtenerProveedorBW _obtenerProveedorBW;
        private readonly IAgregarProveedorBW _agregarProveedorBW;
        private readonly IModificarProveedorBW _modificarProveedorBW;
        private readonly IModificarEstadoProveedorBW _modificarEstadoProveedorBW;

        public ProveedoresController(
            IObtenerProveedorBW obtenerProveedorBW,
            IAgregarProveedorBW agregarProveedorBW,
            IModificarProveedorBW modificarProveedorBW,
            IModificarEstadoProveedorBW modificarEstadoProveedorBW)
        {
            _obtenerProveedorBW = obtenerProveedorBW;
            _agregarProveedorBW = agregarProveedorBW;
            _modificarProveedorBW = modificarProveedorBW;
            _modificarEstadoProveedorBW = modificarEstadoProveedorBW;
        }

        /// <summary>
        /// Obtiene todos los Proveedores disponibles en el sistema con paginación.
        /// </summary>
        /// <remarks>
        /// Devuelve una lista de Proveedores junto con el modelo de validación y datos de paginación.
        /// </remarks>
        /// <returns>Un objeto <see cref="ProveedorConModeloDeValidacion"/> que contiene la lista de Proveedores y el estado de la validación.</returns>
        /// <response code="200">Operación exitosa. Retorna la lista de Proveedores.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpPost("ObtenerProveedor")]
        public async Task<ProveedorConModeloDeValidacion> ObtenerProveedor(ParametroConsultaProveedor parametroConsultaProveedor)
        {
            ProveedorConModeloDeValidacion laListaDeProveedores = await _obtenerProveedorBW.ObtenerProveedores(parametroConsultaProveedor);
            return laListaDeProveedores;
        }

        /// <summary>
        /// Inserta un proveedor en la base de datos.
        /// </summary>
        /// <remarks>
        /// Devuelve un modelo de validación para establecer si guardó el proveedor o no.
        /// </remarks>
        /// <returns>Un objeto <see cref="ModeloValidacion"/> que contiene el estado de la validación.</returns>
        /// <response code="200">Operación exitosa. Retorna un modelo de validación.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpPost("AgregarProveedor")]
        public async Task<ModeloValidacion> AgregarProveedor(ProveedorDto parametroProveedor)
        {
            ModeloValidacion resultadoModeloValidacion = await _agregarProveedorBW.AgregarProveedor(parametroProveedor);
            return resultadoModeloValidacion;
        }

        /// <summary>
        /// Actualiza un proveedor en la base de datos.
        /// </summary>
        /// <remarks>
        /// Devuelve un modelo de validación para establecer si guardó el proveedor o no.
        /// </remarks>
        /// <returns>Un objeto <see cref="ModeloValidacion"/> que contiene el estado de la validación.</returns>
        /// <response code="200">Operación exitosa. Retorna un modelo de validación.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpPost("ActualizarProveedor")]
        public async Task<ModeloValidacion> ActualizarProveedor(ProveedorDto parametroProveedor)
        {
            ModeloValidacion resultadoModeloValidacion = await _modificarProveedorBW.ModificarProveedor(parametroProveedor);
            return resultadoModeloValidacion;
        }

        /// <summary>
        /// Activa o inactiva un proveedor en la base de datos.
        /// </summary>
        /// <remarks>
        /// Devuelve un modelo de validación para establecer si cambió su estado o no.
        /// </remarks>
        /// <returns>Un objeto <see cref="ModeloValidacion"/> que contiene el estado de la validación.</returns>
        /// <response code="200">Operación exitosa. Retorna un modelo de validación.</response>
        /// <response code="500">Error interno del servidor.</response>
        [HttpPost("ModificaEstadoProveedor")]
        public async Task<ModeloValidacion> ModificaEstadoProveedor(ProveedorInActivaDto parametroProveedor)
        {
            ModeloValidacion resultadoModeloValidacion = await _modificarEstadoProveedorBW.ModificaEstadoProveedor(parametroProveedor);
            return resultadoModeloValidacion;
        }
    }
}
