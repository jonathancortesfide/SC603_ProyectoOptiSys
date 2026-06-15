using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Usuarios;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;

namespace Softlithe.ERP.Api.Controllers;

[Route("api/[controller]")]
[ApiController]
public class UsuarioController : ControllerBase
{
    private readonly IObtenerUsuarioBW _obtenerUsuarioBW;
    private readonly IAgregarUsuarioBW _agregarUsuarioBW;
    private readonly IModificarUsuarioBW _modificarUsuarioBW;
    private readonly IModificarEstadoUsuarioBW _modificarEstadoUsuarioBW;

    public UsuarioController(
        IObtenerUsuarioBW obtenerUsuarioBW,
        IAgregarUsuarioBW agregarUsuarioBW,
        IModificarUsuarioBW modificarUsuarioBW,
        IModificarEstadoUsuarioBW modificarEstadoUsuarioBW)
    {
        _obtenerUsuarioBW = obtenerUsuarioBW;
        _agregarUsuarioBW = agregarUsuarioBW;
        _modificarUsuarioBW = modificarUsuarioBW;
        _modificarEstadoUsuarioBW = modificarEstadoUsuarioBW;
    }

    /// <summary>
    /// Lista usuarios por <c>identificador</c> (obligatorio). Si <c>descripcion</c> está vacía devuelve todos del identificador; si no, filtra por nombre.
    /// </summary>
    [HttpPost("ObtenerUsuario")]
    public async Task<UsuarioConModeloDeValidacion> ObtenerUsuario(ParametroConsultaUsuario parametro)
    {
        return await _obtenerUsuarioBW.ObtenerUsuario(parametro);
    }

    [HttpPost("AgregarUsuario")]
    public async Task<ModeloValidacion> AgregarUsuario(AgregarUsuarioDto parametro)
    {
        return await _agregarUsuarioBW.AgregarUsuario(parametro);
    }

    /// <summary>
    /// Actualiza por <c>id_usuario</c> únicamente en el WHERE (no usar <c>identificador</c> en el filtro).
    /// </summary>
    [HttpPost("ModificarUsuario")]
    public async Task<ModeloValidacion> ModificarUsuario(ModificarUsuarioDto parametro)
    {
        return await _modificarUsuarioBW.ModificarUsuario(parametro);
    }

    /// <summary>
    /// Cambia estado activo/inactivo por <c>id_usuario</c> únicamente en el WHERE.
    /// </summary>
    [HttpPost("ModificarEstadoUsuario")]
    public async Task<ModeloValidacion> ModificarEstadoUsuario(ModificarEstadoUsuarioDto parametro)
    {
        return await _modificarEstadoUsuarioBW.ModificarEstadoUsuario(parametro);
    }

    /// <summary>
    /// Obtiene un usuario por <c>id_usuario</c> únicamente en el WHERE.
    /// </summary>
    [HttpPost("ObtenerUsuarioPorId")]
    public async Task<ModeloValidacionConDatos<UsuarioDto?>> ObtenerUsuarioPorId(ParametroConsultaUsuarioPorId parametro)
    {
        return await _obtenerUsuarioBW.ObtenerUsuarioPorId(parametro);
    }

    /// <summary>
    /// Obtiene el perfil del usuario por correo (<c>email</c> en la tabla <c>Usuario</c>), p. ej. para el menú de perfil.
    /// </summary>
    [HttpPost("ObtenerUsuarioPorCorreo")]
    public async Task<ModeloValidacionConDatos<UsuarioDto?>> ObtenerUsuarioPorCorreo(ParametroConsultaUsuarioPorCorreo parametro)
    {
        return await _obtenerUsuarioBW.ObtenerUsuarioPorCorreo(parametro);
    }

    [HttpPost("ObtenerDoctores/{identificador}")]
    public async Task<ModeloValidacionConDatos<System.Collections.Generic.List<UsuarioDto>>> ObtenerDoctores([FromRoute] int identificador)
    {
        return await _obtenerUsuarioBW.ObtenerDoctores(identificador);
    }
}
