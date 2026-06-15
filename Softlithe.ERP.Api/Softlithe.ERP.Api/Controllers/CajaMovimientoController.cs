using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.CajaMovimientos;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.CajaMovimientos;

namespace Softlithe.ERP.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class CajaMovimientoController : ControllerBase
{
    private readonly IObtenerCajaMovimientoBW _obtenerCajaMovimientoBW;
    private readonly IAgregarCajaMovimientoBW _agregarCajaMovimientoBW;
    private readonly IAperturaCajaBW _aperturaCajaBW;

    public CajaMovimientoController(
        IObtenerCajaMovimientoBW obtenerCajaMovimientoBW,
        IAgregarCajaMovimientoBW agregarCajaMovimientoBW,
        IAperturaCajaBW aperturaCajaBW)
    {
        _obtenerCajaMovimientoBW = obtenerCajaMovimientoBW;
        _agregarCajaMovimientoBW = agregarCajaMovimientoBW;
        _aperturaCajaBW = aperturaCajaBW;
    }

    [HttpPost("ObtenerMovimientos")]
    public async Task<CajaMovimientoConModeloDeValidacion> ObtenerMovimientos(ParametroConsultaCajaMovimiento parametro)
    {
        return await _obtenerCajaMovimientoBW.ObtenerMovimientos(parametro);
    }

    [HttpPost("ObtenerCierreActivo")]
    public async Task<CajaCierreConModeloDeValidacion> ObtenerCierreActivo(ParametroConsultaCierreActivo parametro)
    {
        return await _obtenerCajaMovimientoBW.ObtenerCierreActivo(parametro);
    }

    [HttpPost("AgregarMovimiento")]
    public async Task<ModeloValidacion> AgregarMovimiento(AgregarCajaMovimientoDto parametro)
    {
        return await _agregarCajaMovimientoBW.AgregarMovimiento(parametro);
    }

    [HttpPost("AperturaCaja")]
    public async Task<AperturaCajaConModeloDeValidacion> AperturaCaja(AperturaCajaDto parametro)
    {
        return await _aperturaCajaBW.AperturarCaja(parametro);
    }
}
