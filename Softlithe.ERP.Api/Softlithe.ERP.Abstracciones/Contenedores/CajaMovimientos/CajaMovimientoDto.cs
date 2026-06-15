using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Cajas;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.CajaMovimientos;

public class CajaMovimientoDto
{
    public int IdMovimiento { get; set; }

    public int IdCierre { get; set; }

    public int NoTipoMovimiento { get; set; }

    public string? NombreTipoMovimiento { get; set; }

    public int? NoFormaPago { get; set; }

    public string? NombreFormaPago { get; set; }

    public int NoMoneda { get; set; }

    public decimal Monto { get; set; }

    public string? Concepto { get; set; }

    public DateTime FechaRegistro { get; set; }

    public int IdUsuario { get; set; }

    public int? IdDocumentoOrigen { get; set; }

    public string? TipoDocumentoOrigen { get; set; }
}

public class CajaCierreDto
{
    public int IdCierre { get; set; }

    public int NoCierre { get; set; }

    public int NoCaja { get; set; }

    public string? NombreCaja { get; set; }

    public string Estado { get; set; } = string.Empty;

    public int Identificador { get; set; }

    public DateTime FechaApertura { get; set; }

    public DateTime? FechaCierre { get; set; }

    public int? IdUsuarioApertura { get; set; }

    public decimal MontoApertura { get; set; }

    public string? Observaciones { get; set; }
}

public class AgregarCajaMovimientoDto
{
    [Required(ErrorMessage = MensajeDeCajaMovimientoDto.CodigoCierreRequerido)]
    public int IdCierre { get; set; }

    [Required(ErrorMessage = MensajeDeCajaMovimientoDto.CodigoTipoMovimientoRequerido)]
    public int NoTipoMovimiento { get; set; }

    public int? NoFormaPago { get; set; }

    [Required(ErrorMessage = MensajeDeCajaMovimientoDto.CodigoMonedaRequerido)]
    public int NoMoneda { get; set; }

    [Required(ErrorMessage = MensajeDeCajaMovimientoDto.MontoRequerido)]
    public decimal Monto { get; set; }

    public string? Concepto { get; set; }

    [Required(ErrorMessage = MensajeDeCajaMovimientoDto.CodigoUsuarioRequerido)]
    public int IdUsuario { get; set; }

    public int? IdDocumentoOrigen { get; set; }

    public string? TipoDocumentoOrigen { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
    public string Usuario { get; set; } = string.Empty;

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
    public int Identificador { get; set; }
}

public class AperturaCajaDto
{
    [Required(ErrorMessage = MensajeDeCajaDto.CodigoCajaRequerido)]
    public int NoCaja { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
    public int Identificador { get; set; }

    [Required(ErrorMessage = MensajeDeCajaMovimientoDto.MontoRequerido)]
    public decimal MontoApertura { get; set; }

    [Required(ErrorMessage = MensajeDeCajaMovimientoDto.CodigoMonedaRequerido)]
    public int NoMoneda { get; set; }

    public int? NoFormaPago { get; set; }

    public int? NoTipoMovimiento { get; set; }

    public string? Concepto { get; set; }

    public string? Observaciones { get; set; }

    [Required(ErrorMessage = MensajeDeCajaMovimientoDto.CodigoUsuarioRequerido)]
    public int IdUsuario { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
    public string Usuario { get; set; } = string.Empty;
}

public class ParametroConsultaCajaMovimiento
{
    [Required(ErrorMessage = MensajeDeCajaMovimientoDto.CodigoCierreRequerido)]
    public int IdCierre { get; set; }
}

public class ParametroConsultaCierreActivo
{
    [Required(ErrorMessage = MensajeDeCajaDto.CodigoCajaRequerido)]
    public int NoCaja { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
    public int Identificador { get; set; }
}

public class CajaMovimientoConModeloDeValidacion : ModeloValidacion
{
    public List<CajaMovimientoDto> ListaMovimientos { get; set; } = new();
}

public class CajaCierreConModeloDeValidacion : ModeloValidacion
{
    public CajaCierreDto? CierreActivo { get; set; }
}

public class AperturaCajaConModeloDeValidacion : ModeloValidacion
{
    public int IdCierre { get; set; }

    public int NoCierre { get; set; }

    public int IdMovimiento { get; set; }
}
