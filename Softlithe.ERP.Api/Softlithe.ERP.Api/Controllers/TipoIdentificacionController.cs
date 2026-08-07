using System.Data;
using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.Api.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class TipoIdentificacionController : ControllerBase
{
    private readonly ContextoBasedeDatos _contexto;

    public TipoIdentificacionController(ContextoBasedeDatos contexto)
    {
        _contexto = contexto;
    }

    [HttpGet("ObtenerTipoIdentificacion")]
    public async Task<List<TipoIdentificacionDto>> ObtenerTipoIdentificacion()
    {
        var conexion = _contexto.Database.GetDbConnection();

        if (conexion.State == ConnectionState.Closed)
        {
            await conexion.OpenAsync();
        }

        const string sql = @"
            SELECT
                id_tipo_identificacion AS IdTipoIdentificacion,
                codigo AS Codigo,
                nombre AS Nombre,
                activo AS Activo
            FROM dbo.TipoIdentificacion
            WHERE activo = 1
            ORDER BY id_tipo_identificacion";

        var tipos = await conexion.QueryAsync<TipoIdentificacionDto>(sql);
        return tipos.ToList();
    }
}