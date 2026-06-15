using Softlithe.ERP.Abstracciones.BW.CajaMovimientos;
using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.CajaMovimientos;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.CajaMovimientos;

namespace Softlithe.ERP.BW.CajaMovimientos;

public class AgregarCajaMovimientoBW : IAgregarCajaMovimientoBW
{
    private readonly IAgregarCajaMovimientoDA _agregarCajaMovimientoDA;
    private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
    private readonly IErrorLogger _logger;

    public AgregarCajaMovimientoBW(
        IAgregarCajaMovimientoDA agregarCajaMovimientoDA,
        IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
        IErrorLogger errorLogger)
    {
        _agregarCajaMovimientoDA = agregarCajaMovimientoDA;
        _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
        _logger = errorLogger;
    }

    public async Task<ModeloValidacion> AgregarMovimiento(AgregarCajaMovimientoDto dto)
    {
        try
        {
            int resultado = await _agregarCajaMovimientoDA.AgregarMovimiento(dto);
            int respuestaBitacora = await AgregarEventoBitacoraCorrecto(dto, resultado);
            return ConstruirRespuestaExitosa(resultado, respuestaBitacora);
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return ConstruirRespuestaExitosa(0, 1);
        }
    }

    private ModeloValidacion ConstruirRespuestaExitosa(int resultadoRegistro, int errorBitacora)
    {
        return new ModeloValidacion
        {
            Mensaje = (resultadoRegistro > 0
                    ? MensajeDeCajaMovimientoDto.MovimientoAgregadoCorrectamente
                    : MensajeDeCajaMovimientoDto.MovimientoNoGuardado + MensajeDeCajaMovimientoDto.CierreNoAbierto)
                  + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
            EsCorrecto = resultadoRegistro > 0,
        };
    }

    private async Task<int> AgregarEventoBitacoraCorrecto(AgregarCajaMovimientoDto dto, int resultadoRegistro)
    {
        return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
        {
            descripcionDelEvento = resultadoRegistro > 0
                ? MensajeDeCajaMovimientoDto.MovimientoAgregadoCorrectamente + " id_cierre: " + dto.IdCierre
                : MensajeDeCajaMovimientoDto.MovimientoNoGuardado + " id_cierre: " + dto.IdCierre,
            fechaDeRegistro = DateTime.Now,
            nombreDelMetodo = nameof(AgregarMovimiento),
            tabla = "CajaMovimiento",
            idBitacora = Guid.NewGuid(),
            identificador = dto.Identificador,
            usuario = dto.Usuario,
        });
    }
}
