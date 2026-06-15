using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Vendedores;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Vendedores;

namespace Softlithe.ERP.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class VendedorController : ControllerBase
{
    private readonly IObtenerVendedorBW _obtenerVendedorBW;
    private readonly IAgregarVendedorBW _agregarVendedorBW;
    private readonly IModificarVendedorBW _modificarVendedorBW;
    private readonly IModificarEstadoVendedorBW _modificarEstadoVendedorBW;

    public VendedorController(
        IObtenerVendedorBW obtenerVendedorBW,
        IAgregarVendedorBW agregarVendedorBW,
        IModificarVendedorBW modificarVendedorBW,
        IModificarEstadoVendedorBW modificarEstadoVendedorBW)
    {
        _obtenerVendedorBW = obtenerVendedorBW;
        _agregarVendedorBW = agregarVendedorBW;
        _modificarVendedorBW = modificarVendedorBW;
        _modificarEstadoVendedorBW = modificarEstadoVendedorBW;
    }

    /// <summary>
    /// Lista vendedores por <c>identificador</c> (obligatorio). Si <c>descripcion</c> está vacía devuelve todos.
    /// </summary>
    [HttpPost("ObtenerVendedor")]
    public async Task<VendedorConModeloDeValidacion> ObtenerVendedor(ParametroConsultaVendedor parametro)
    {
        return await _obtenerVendedorBW.ObtenerVendedores(parametro);
    }

    /// <summary>
    /// Vendedor por defecto: registro activo cuyo <c>id_usuario</c> coincide con el usuario logueado.
    /// La lista devuelve 0 o 1 elemento. Para elegir otro vendedor use <see cref="ObtenerVendedor"/>.
    /// </summary>
    [HttpPost("ObtenerVendedorPorUsuario")]
    public async Task<VendedorConModeloDeValidacion> ObtenerVendedorPorUsuario(ParametroConsultaVendedorPorUsuario parametro)
    {
        return await _obtenerVendedorBW.ObtenerVendedorPorUsuario(parametro);
    }

    [HttpPost("AgregarVendedor")]
    public async Task<ModeloValidacion> AgregarVendedor(AgregarVendedorDto parametro)
    {
        return await _agregarVendedorBW.AgregarVendedor(parametro);
    }

    /// <summary>
    /// Actualiza por <c>no_vendedor</c> (no se filtra por <c>identificador</c> en el WHERE).
    /// </summary>
    [HttpPost("ModificarVendedor")]
    public async Task<ModeloValidacion> ModificarVendedor(ModificarVendedorDto parametro)
    {
        return await _modificarVendedorBW.ModificarVendedor(parametro);
    }

    /// <summary>
    /// Cambia estado activo/inactivo por <c>no_vendedor</c> únicamente en el WHERE.
    /// </summary>
    [HttpPost("ModificarEstadoVendedor")]
    public async Task<ModeloValidacion> ModificarEstadoVendedor(ModificarEstadoVendedorDto parametro)
    {
        return await _modificarEstadoVendedorBW.ModificarEstadoVendedor(parametro);
    }
}
