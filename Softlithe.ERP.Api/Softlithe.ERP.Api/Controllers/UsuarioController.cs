using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Usuarios;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;
using Softlithe.ERP.Abstracciones.Servicios;
using Softlithe.ERP.Api.Atributos;

namespace Softlithe.ERP.Api.Controllers;

[Authorize]
[Route("api/[controller]")]
[ApiController]
public class UsuarioController : ControllerBase
{
    private readonly IObtenerUsuarioBW _obtenerUsuarioBW;
    private readonly IAgregarUsuarioBW _agregarUsuarioBW;
    private readonly IModificarUsuarioBW _modificarUsuarioBW;
    private readonly IModificarEstadoUsuarioBW _modificarEstadoUsuarioBW;
    private readonly IAsignarSucursalUsuarioBW _asignarSucursalUsuarioBW;
    private readonly IEmailService _emailService;
    private readonly IConfiguration _config;
    private readonly ILogger<UsuarioController> _logger;

    public UsuarioController(
        IObtenerUsuarioBW obtenerUsuarioBW,
        IAgregarUsuarioBW agregarUsuarioBW,
        IModificarUsuarioBW modificarUsuarioBW,
        IModificarEstadoUsuarioBW modificarEstadoUsuarioBW,
        IAsignarSucursalUsuarioBW asignarSucursalUsuarioBW,
        IEmailService emailService,
        IConfiguration config,
        ILogger<UsuarioController> logger)
    {
        _obtenerUsuarioBW = obtenerUsuarioBW;
        _agregarUsuarioBW = agregarUsuarioBW;
        _modificarUsuarioBW = modificarUsuarioBW;
        _modificarEstadoUsuarioBW = modificarEstadoUsuarioBW;
        _asignarSucursalUsuarioBW = asignarSucursalUsuarioBW;
        _emailService = emailService;
        _config = config;
        _logger = logger;
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
        var resultado = await _agregarUsuarioBW.AgregarUsuario(parametro);

        if (resultado.EsCorrecto)
        {
            _ = EnviarCorreoActivacionAsync(parametro.Email, parametro.Nombre);
        }

        return resultado;
    }

    private async Task EnviarCorreoActivacionAsync(string email, string nombre)
    {
        try
        {
            var baseUrl = _config["EmailConfig:UrlSpa"] ?? "http://localhost:5173";
            var url = $"{baseUrl}/activar-cuenta?email={Uri.EscapeDataString(email)}";
            await _emailService.EnviarInvitacionActivacionAsync(email, nombre, url);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "No se pudo enviar el correo de activación a {Email}", email);
        }
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

    /// <summary>
    /// Obtiene todos los doctores (usuarios con EsDoctor = true) para un identificador de sucursal.
    /// </summary>
    [HttpPost("ObtenerDoctores/{identificador}")]
    public async Task<ModeloValidacionConDatos<List<UsuarioDto>>> ObtenerDoctores([FromRoute] int identificador)
    {
        return await _obtenerUsuarioBW.ObtenerDoctores(identificador);
    }

    /// <summary>
    /// Busca usuarios que no tienen ninguna sucursal asignada (para que el admin los vincule).
    /// </summary>
    [RequierePermiso("USUARIO_SIN_SUCURSAL_VER")]
    [HttpPost("BuscarParaAsignar")]
    public async Task<ModeloValidacionConDatos<List<UsuarioDto>>> BuscarParaAsignar(BuscarUsuarioSinSucursalDto parametro)
    {
        return await _obtenerUsuarioBW.BuscarSinSucursal(parametro);
    }

    /// <summary>
    /// Vincula un usuario existente a una empresa-sucursal.
    /// </summary>
    [RequierePermiso("USUARIO_ASIGNAR_SUCURSAL")]
    [HttpPost("AsignarSucursal")]
    public async Task<ModeloValidacion> AsignarSucursal(AsignarSucursalUsuarioDto parametro)
    {
        return await _asignarSucursalUsuarioBW.AsignarSucursal(parametro);
    }
}
