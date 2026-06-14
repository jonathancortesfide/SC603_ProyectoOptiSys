using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Vendedores;

public class VendedorDto
{
    public int NoVendedor { get; set; }

    public string Descripcion { get; set; } = string.Empty;

    public int Identificador { get; set; }

    public int? IdUsuario { get; set; }

    public bool EsActivo { get; set; }
}

/// <summary>
/// Alta de vendedor (sin <c>no_vendedor</c>; es IDENTITY).
/// </summary>
public class AgregarVendedorDto
{
    public string? Descripcion { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
    public int Identificador { get; set; }

    public int? IdUsuario { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.DatoEsActivoRequerido)]
    public bool EsActivo { get; set; } = true;

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
    public string Usuario { get; set; } = string.Empty;
}

/// <summary>
/// Actualización por <c>no_vendedor</c> únicamente en el WHERE (no usar identificador en el filtro).
/// </summary>
public class ModificarVendedorDto
{
    [Required(ErrorMessage = MensajeDeVendedorDto.CodigoVendedorRequerido)]
    public int NoVendedor { get; set; }

    public string? Descripcion { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
    public int Identificador { get; set; }

    public int? IdUsuario { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
    public string Usuario { get; set; } = string.Empty;
}

public class ModificarEstadoVendedorDto
{
    [Required(ErrorMessage = MensajeDeVendedorDto.CodigoVendedorRequerido)]
    public int NoVendedor { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.DatoEsActivoRequerido)]
    public bool EsActivo { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
    public string Usuario { get; set; } = string.Empty;

    /// <summary>
    /// Para bitácora; no se usa en el UPDATE del registro.
    /// </summary>
    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
    public int Identificador { get; set; }
}

public class VendedorConModeloDeValidacion : ModeloValidacion
{
    public List<VendedorDto> ListaVendedores { get; set; } = new();
}
