using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Graduaciones.ObtenerGraduacionPorIdentificador;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Graduaciones;

namespace Softlithe.ERP.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GraduacionController
{

    private readonly IObtenerGraduacionPorIdentificadorBW _obtenerGraduacionPorIdentificador;

    public GraduacionController(IObtenerGraduacionPorIdentificadorBW obtenerGraduacionPorIdentificador)
    {
        _obtenerGraduacionPorIdentificador = obtenerGraduacionPorIdentificador;
    }

    [HttpGet("Obtener")] 
    public async Task<GraduacionConModeloDeValidacion> Obtener([FromQuery] int identificador)
    {
        return await _obtenerGraduacionPorIdentificador.Obtener(identificador);
    }


}

