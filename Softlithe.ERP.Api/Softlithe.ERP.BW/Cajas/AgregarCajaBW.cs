using Softlithe.ERP.Abstracciones.BW.Cajas;
using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Cajas;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Cajas;

namespace Softlithe.ERP.BW.Cajas;

public class AgregarCajaBW : IAgregarCajaBW
{
    private readonly IAgregarCajaDA _agregarCajaDA;
    private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
    private readonly IErrorLogger _logger;

    public AgregarCajaBW(
        IAgregarCajaDA agregarCajaDA,
        IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
        IErrorLogger errorLogger)
    {
        _agregarCajaDA = agregarCajaDA;
        _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
        _logger = errorLogger;
    }

    public async Task<ModeloValidacion> AgregarCaja(AgregarCajaDto dto)
    {
        try
        {
            int resultado = await _agregarCajaDA.AgregarCaja(dto);
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
            Mensaje = (resultadoRegistro > 0 ? MensajeDeCajaDto.CajaAgregadaCorrectamente : MensajeDeCajaDto.CajaNoGuardada)
                      + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
            EsCorrecto = resultadoRegistro > 0,
        };
    }

    private async Task<int> AgregarEventoBitacoraCorrecto(AgregarCajaDto dto, int resultadoRegistro)
    {
        return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
        {
            descripcionDelEvento = resultadoRegistro > 0
                ? MensajeDeCajaDto.CajaAgregadaCorrectamente + " Nombre: " + (dto.Nombre ?? string.Empty)
                : MensajeDeCajaDto.CajaNoGuardada + " Nombre: " + (dto.Nombre ?? string.Empty),
            fechaDeRegistro = DateTime.Now,
            nombreDelMetodo = nameof(AgregarCaja),
            tabla = "Caja",
            idBitacora = Guid.NewGuid(),
            identificador = dto.Identificador,
            usuario = dto.Usuario,
        });
    }
}
