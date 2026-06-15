using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Paises;
using Softlithe.ERP.Abstracciones.Contenedores.Paises;

namespace Softlithe.ERP.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class PaisesController : ControllerBase
{
    private readonly IObtenerPaisBW _obtenerPaisBw;

    public PaisesController(IObtenerPaisBW obtenerPaisBw)
    {
        _obtenerPaisBw = obtenerPaisBw;
    }

    /// <summary>Obtiene todos los países del catálogo (tabla Pais). Filtro opcional por nombre.</summary>
    /// <response code="200">Lista de países y estado de la operación.</response>
    /// <response code="500">Error interno del servidor.</response>
    [HttpPost("ObtenerPais")]
    public async Task<PaisConModeloDeValidacion> ObtenerPais(ParametroConsultaPais parametroConsultaPais)
    {
        return await _obtenerPaisBw.ObtenerPaises(parametroConsultaPais);
    }
}
