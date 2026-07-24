using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Usuarios;

public class UsuarioDto
{
    public int IdUsuario { get; set; }

    public string IdIdentityServer { get; set; } = string.Empty;

    public int Identificador { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public bool? EsDoctor { get; set; }

    public string? CodigoProfesional { get; set; }

    public string Email { get; set; } = string.Empty;

    public string? Telefono { get; set; }

    public string? Direccion { get; set; }

    public DateTime? FechaNacimiento { get; set; }

    public bool EsActivo { get; set; }
}

public class AgregarUsuarioDto
{
    public string? IdIdentityServer { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
    public int Identificador { get; set; }

    [Required]
    public string Nombre { get; set; } = string.Empty;

    public bool? EsDoctor { get; set; }

    public string? CodigoProfesional { get; set; }

    [Required]
    public string Email { get; set; } = string.Empty;

    public string? Telefono { get; set; }

    public string? Direccion { get; set; }

    public DateTime? FechaNacimiento { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.DatoEsActivoRequerido)]
    public bool EsActivo { get; set; } = true;

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
    public string Usuario { get; set; } = string.Empty;
}

/// <summary>
/// Actualización filtrando solo por <c>id_usuario</c> (no usar <c>identificador</c> en el WHERE).
/// </summary>
public class ModificarUsuarioDto
{
    [Required(ErrorMessage = MensajeDeUsuarioDto.CodigoUsuarioRequerido)]
    public int IdUsuario { get; set; }

    [Required]
    public string IdIdentityServer { get; set; } = string.Empty;

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
    public int Identificador { get; set; }

    [Required]
    public string Nombre { get; set; } = string.Empty;

    public bool? EsDoctor { get; set; }

    public string? CodigoProfesional { get; set; }

    [Required]
    public string Email { get; set; } = string.Empty;

    public string? Telefono { get; set; }

    public string? Direccion { get; set; }

    public DateTime? FechaNacimiento { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
    public string Usuario { get; set; } = string.Empty;
}

public class ModificarEstadoUsuarioDto
{
    [Required(ErrorMessage = MensajeDeUsuarioDto.CodigoUsuarioRequerido)]
    public int IdUsuario { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.DatoEsActivoRequerido)]
    public bool EsActivo { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
    public string Usuario { get; set; } = string.Empty;

    /// <summary>Para bitácora; no se usa en el UPDATE del registro.</summary>
    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
    public int Identificador { get; set; }
}

public class RespuestaCambiarEstadoUsuarioDA
{
    public UsuarioDto ModeloUsuario { get; set; } = new();

    public int ResultadoRegistro { get; set; }
}

public class UsuarioConModeloDeValidacion : ModeloValidacion
{
    public List<UsuarioDto> ListaUsuarios { get; set; } = new();
}
