using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Bodegas;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Bodegas;

namespace Softlithe.ERP.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BodegasController : ControllerBase
{
    private readonly IObtenerBodegaBW _obtenerBodegaBW;
    private readonly IAgregarBodegaBW _agregarBodegaBW;
    private readonly IModificarBodegaBW _modificarBodegaBW;
    private readonly IModificarEstadoBodegaBW _modificarEstadoBodegaBW;

    public BodegasController(
        IObtenerBodegaBW obtenerBodegaBW,
        IAgregarBodegaBW agregarBodegaBW,
        IModificarBodegaBW modificarBodegaBW,
        IModificarEstadoBodegaBW modificarEstadoBodegaBW)
    {
        _obtenerBodegaBW = obtenerBodegaBW;
        _agregarBodegaBW = agregarBodegaBW;
        _modificarBodegaBW = modificarBodegaBW;
        _modificarEstadoBodegaBW = modificarEstadoBodegaBW;
    }

    /// <summary>
    /// Lista bodegas por código de empresa (<c>no_empresa</c> obligatorio).
    /// Si descripción viene vacía se devuelven todas las bodegas de esa empresa; si no, se filtra por coincidencia parcial.
    /// </summary>
    [HttpPost("ObtenerBodega")]
    public async Task<BodegaConModeloDeValidacion> ObtenerBodega(ParametroConsultaBodega parametro)
    {
        return await _obtenerBodegaBW.ObtenerBodegas(parametro);
    }

    /// <summary>
    /// Registra una nueva bodega indicando el <c>no_empresa</c> de la empresa.
    /// </summary>
    [HttpPost("AgregarBodega")]
    public async Task<ModeloValidacion> AgregarBodega(AgregarBodegaDto parametro)
    {
        return await _agregarBodegaBW.AgregarBodega(parametro);
    }

    /// <summary>
    /// Actualiza la descripción de una bodega existente.
    /// </summary>
    [HttpPost("ModificarBodega")]
    public async Task<ModeloValidacion> ModificarBodega(ModificarBodegaDto parametro)
    {
        return await _modificarBodegaBW.ModificarBodega(parametro);
    }

    /// <summary>
    /// Activa o inactiva una bodega.
    /// </summary>
    [HttpPost("ModificarEstadoBodega")]
    public async Task<ModeloValidacion> ModificarEstadoBodega(ModificarEstadoBodegaDto parametro)
    {
        return await _modificarEstadoBodegaBW.ModificarEstadoBodega(parametro);
    }
}
