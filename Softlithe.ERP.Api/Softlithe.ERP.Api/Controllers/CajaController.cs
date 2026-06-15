using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Cajas;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Cajas;

namespace Softlithe.ERP.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CajaController : ControllerBase
{
    private readonly IObtenerCajaBW _obtenerCajaBW;
    private readonly IAgregarCajaBW _agregarCajaBW;
    private readonly IModificarCajaBW _modificarCajaBW;
    private readonly IModificarEstadoCajaBW _modificarEstadoCajaBW;

    public CajaController(
        IObtenerCajaBW obtenerCajaBW,
        IAgregarCajaBW agregarCajaBW,
        IModificarCajaBW modificarCajaBW,
        IModificarEstadoCajaBW modificarEstadoCajaBW)
    {
        _obtenerCajaBW = obtenerCajaBW;
        _agregarCajaBW = agregarCajaBW;
        _modificarCajaBW = modificarCajaBW;
        _modificarEstadoCajaBW = modificarEstadoCajaBW;
    }

    [HttpPost("ObtenerCaja")]
    public async Task<CajaConModeloDeValidacion> ObtenerCaja(ParametroConsultaCaja parametro)
    {
        return await _obtenerCajaBW.ObtenerCajas(parametro);
    }

    [HttpPost("AgregarCaja")]
    public async Task<ModeloValidacion> AgregarCaja(AgregarCajaDto parametro)
    {
        return await _agregarCajaBW.AgregarCaja(parametro);
    }

    [HttpPost("ModificarCaja")]
    public async Task<ModeloValidacion> ModificarCaja(ModificarCajaDto parametro)
    {
        return await _modificarCajaBW.ModificarCaja(parametro);
    }

    [HttpPost("ModificarEstadoCaja")]
    public async Task<ModeloValidacion> ModificarEstadoCaja(ModificarEstadoCajaDto parametro)
    {
        return await _modificarEstadoCajaBW.ModificarEstadoCaja(parametro);
    }
}
