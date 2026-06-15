using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Graduaciones.AgregarGraduacion;
using Softlithe.ERP.Abstracciones.BW.Graduaciones.ModificarEstadoGraduacion;
using Softlithe.ERP.Abstracciones.BW.Graduaciones.ModificarGraduacion;
using Softlithe.ERP.Abstracciones.BW.Graduaciones.ObtenerGraduacionPorIdentificador;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Graduaciones;

namespace Softlithe.ERP.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class GraduacionController : ControllerBase
{
    private readonly IAgregarGraduacionBW _agregarGraduacion;
    private readonly IModificarGraduacionBW _modificarGraduacion;
    private readonly IObtenerGraduacionPorIdentificadorBW _obtenerGraduacionPorIdentificador;
    private readonly IModificarEstadoGraduacionBW _modificarEstadoGraduacion;

    public GraduacionController(
        IAgregarGraduacionBW agregarGraduacion,
        IModificarGraduacionBW modificarGraduacion,
        IObtenerGraduacionPorIdentificadorBW obtenerGraduacionPorIdentificador,
        IModificarEstadoGraduacionBW modificarEstadoGraduacion)
    {
        _agregarGraduacion = agregarGraduacion;
        _modificarGraduacion = modificarGraduacion;
        _obtenerGraduacionPorIdentificador = obtenerGraduacionPorIdentificador;
        _modificarEstadoGraduacion = modificarEstadoGraduacion;
    }

    [HttpGet("Obtener")]
    public async Task<GraduacionConModeloDeValidacion> Obtener([FromQuery] int identificador)
    {
        return await _obtenerGraduacionPorIdentificador.Obtener(identificador);
    }

    [HttpPost("Agregar")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(ModeloValidacion), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Agregar([FromBody] GraduacionDto graduacion)
    {
        if (graduacion == null)
        {
            return BadRequest(new ModeloValidacion
            {
                Mensaje = "Datos inválidos",
                EsCorrecto = false
            });
        }

        return Ok(await _agregarGraduacion.Agregar(graduacion));
    }

    [HttpPut("Modificar")]
    public async Task<ModeloValidacion> Modificar([FromBody] GraduacionDto graduacion)
    {
        return await _modificarGraduacion.ModificarGraduacion(graduacion);
    }

    [HttpPut("ModificarEstado/{idGraduacion}/{activo}")]
    [Produces("application/json")]
    [ProducesResponseType(typeof(ModeloValidacion), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ModificarEstado(int idGraduacion, bool activo)
    {
        if (idGraduacion <= 0)
        {
            return BadRequest(new ModeloValidacion
            {
                Mensaje = "Datos inválidos. El identificador de graduación debe ser mayor a 0.",
                EsCorrecto = false
            });
        }

        try
        {
            int resultado = await _modificarEstadoGraduacion.ModificarEstadoGraduacion(idGraduacion, activo);
            if (resultado == 0)
            {
                return BadRequest(new ModeloValidacion
                {
                    Mensaje = "La graduación no existe.",
                    EsCorrecto = false
                });
            }

            return Ok(new ModeloValidacion
            {
                Mensaje = "Estado de la graduación modificado correctamente.",
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
