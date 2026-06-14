using Softlithe.ERP.Abstracciones.BW.CajaMovimientos;
using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.Contenedores.CajaMovimientos;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.CajaMovimientos;

namespace Softlithe.ERP.BW.CajaMovimientos;

public class AperturaCajaBW : IAperturaCajaBW
{
    private readonly IAperturaCajaDA _aperturaCajaDA;
    private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
    private readonly IErrorLogger _logger;

    public AperturaCajaBW(
        IAperturaCajaDA aperturaCajaDA,
        IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
        IErrorLogger errorLogger)
    {
        _aperturaCajaDA = aperturaCajaDA;
        _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
        _logger = errorLogger;
    }

    public async Task<AperturaCajaConModeloDeValidacion> AperturarCaja(AperturaCajaDto dto)
    {
        try
        {
            AperturaCajaConModeloDeValidacion resultado = await _aperturaCajaDA.AperturarCaja(dto);
            if (resultado.EsCorrecto)
            {
                int respuestaBitacora = await AgregarEventoBitacoraCorrecto(dto, resultado);
                if (respuestaBitacora == 0)
                {
                    resultado.Mensaje += MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora;
                }
            }

            return resultado;
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return new AperturaCajaConModeloDeValidacion
            {
                EsCorrecto = false,
                Mensaje = MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema,
            };
        }
    }

    private async Task<int> AgregarEventoBitacoraCorrecto(AperturaCajaDto dto, AperturaCajaConModeloDeValidacion resultado)
    {
        return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
        {
            descripcionDelEvento = MensajeDeCajaMovimientoDto.AperturaRealizadaCorrectamente
                                   + " no_caja: " + dto.NoCaja
                                   + " id_cierre: " + resultado.IdCierre,
            fechaDeRegistro = DateTime.Now,
            nombreDelMetodo = nameof(AperturarCaja),
            tabla = "CajaCierre",
            idBitacora = Guid.NewGuid(),
            identificador = dto.Identificador,
            usuario = dto.Usuario,
        });
    }
}
