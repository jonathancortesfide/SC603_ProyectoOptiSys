using System.Collections.Generic;
using Softlithe.ERP.Abstracciones.BW.Cajas;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.Contenedores.Cajas;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Cajas;

namespace Softlithe.ERP.BW.Cajas;

public class ObtenerCajaBW : IObtenerCajaBW
{
    private readonly IObtenerCajaDA _obtenerCajaDA;
    private readonly IErrorLogger _logger;

    public ObtenerCajaBW(IObtenerCajaDA obtenerCajaDA, IErrorLogger errorLogger)
    {
        _obtenerCajaDA = obtenerCajaDA;
        _logger = errorLogger;
    }

    public async Task<CajaConModeloDeValidacion> ObtenerCajas(ParametroConsultaCaja parametro)
    {
        if (parametro.Identificador <= 0)
        {
            return new CajaConModeloDeValidacion
            {
                ListaCajas = new List<CajaDto>(),
                Mensaje = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido,
                EsCorrecto = false,
            };
        }

        try
        {
            List<CajaDto> lista = await _obtenerCajaDA.ObtenerCajas(
                parametro.Identificador,
                parametro.Nombre,
                parametro.SoloActivas);

            return new CajaConModeloDeValidacion
            {
                ListaCajas = lista,
                Mensaje = MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = true,
            };
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return new CajaConModeloDeValidacion
            {
                ListaCajas = new List<CajaDto>(),
                Mensaje = MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema,
                EsCorrecto = false,
            };
        }
    }
}
