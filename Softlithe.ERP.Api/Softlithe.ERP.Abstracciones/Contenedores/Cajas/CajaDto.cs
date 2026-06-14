using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Cajas;

public class CajaDto
{
    public int NoCaja { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public int Identificador { get; set; }

    public bool EsActivo { get; set; }

    public bool EsPorDefecto { get; set; }
}

public class AgregarCajaDto
{
    public string? Nombre { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
    public int Identificador { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.DatoEsActivoRequerido)]
    public bool EsActivo { get; set; } = true;

    public bool EsPorDefecto { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
    public string Usuario { get; set; } = string.Empty;
}

public class ModificarCajaDto
{
    [Required(ErrorMessage = MensajeDeCajaDto.CodigoCajaRequerido)]
    public int NoCaja { get; set; }

    public string? Nombre { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
    public int Identificador { get; set; }

    public bool EsPorDefecto { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
    public string Usuario { get; set; } = string.Empty;
}

public class ModificarEstadoCajaDto
{
    [Required(ErrorMessage = MensajeDeCajaDto.CodigoCajaRequerido)]
    public int NoCaja { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.DatoEsActivoRequerido)]
    public bool EsActivo { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
    public string Usuario { get; set; } = string.Empty;

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
    public int Identificador { get; set; }
}

public class ParametroConsultaCaja
{
    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
    public int Identificador { get; set; }

    public string Nombre { get; set; } = string.Empty;

    public bool SoloActivas { get; set; } = true;
}

public class CajaConModeloDeValidacion : ModeloValidacion
{
    public List<CajaDto> ListaCajas { get; set; } = new();
}
