using System.Collections.Generic;
using Softlithe.ERP.Abstracciones.BW.CajaMovimientos;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.Contenedores.CajaMovimientos;
using Softlithe.ERP.Abstracciones.Contenedores.Cajas;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.CajaMovimientos;

namespace Softlithe.ERP.BW.CajaMovimientos;

public class ObtenerCajaMovimientoBW : IObtenerCajaMovimientoBW
{
    private readonly IObtenerCajaMovimientoDA _obtenerCajaMovimientoDA;
    private readonly IErrorLogger _logger;

    public ObtenerCajaMovimientoBW(IObtenerCajaMovimientoDA obtenerCajaMovimientoDA, IErrorLogger errorLogger)
    {
        _obtenerCajaMovimientoDA = obtenerCajaMovimientoDA;
        _logger = errorLogger;
    }

    public async Task<CajaMovimientoConModeloDeValidacion> ObtenerMovimientos(ParametroConsultaCajaMovimiento parametro)
    {
        if (parametro.IdCierre <= 0)
        {
            return new CajaMovimientoConModeloDeValidacion
            {
                ListaMovimientos = new List<CajaMovimientoDto>(),
                Mensaje = MensajeDeCajaMovimientoDto.CodigoCierreRequerido,
                EsCorrecto = false,
            };
        }

        try
        {
            List<CajaMovimientoDto> lista = await _obtenerCajaMovimientoDA.ObtenerMovimientos(parametro.IdCierre);
            return new CajaMovimientoConModeloDeValidacion
            {
                ListaMovimientos = lista,
                Mensaje = MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = true,
            };
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return new CajaMovimientoConModeloDeValidacion
            {
                ListaMovimientos = new List<CajaMovimientoDto>(),
                Mensaje = MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema,
                EsCorrecto = false,
            };
        }
    }

    public async Task<CajaCierreConModeloDeValidacion> ObtenerCierreActivo(ParametroConsultaCierreActivo parametro)
    {
        if (parametro.NoCaja <= 0)
        {
            return new CajaCierreConModeloDeValidacion
            {
                Mensaje = MensajeDeCajaDto.CodigoCajaRequerido,
                EsCorrecto = false,
            };
        }

        if (parametro.Identificador <= 0)
        {
            return new CajaCierreConModeloDeValidacion
            {
                Mensaje = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido,
                EsCorrecto = false,
            };
        }

        try
        {
            CajaCierreDto? cierre = await _obtenerCajaMovimientoDA.ObtenerCierreActivo(parametro.NoCaja, parametro.Identificador);
            return new CajaCierreConModeloDeValidacion
            {
                CierreActivo = cierre,
                Mensaje = MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = true,
            };
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return new CajaCierreConModeloDeValidacion
            {
                Mensaje = MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema,
                EsCorrecto = false,
            };
        }
    }
}
