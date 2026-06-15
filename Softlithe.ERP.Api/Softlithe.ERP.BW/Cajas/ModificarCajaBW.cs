using Softlithe.ERP.Abstracciones.BW.Cajas;
using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Cajas;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Cajas;

namespace Softlithe.ERP.BW.Cajas;

public class ModificarCajaBW : IModificarCajaBW
{
    private readonly IModificarCajaDA _modificarCajaDA;
    private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
    private readonly IErrorLogger _logger;

    public ModificarCajaBW(
        IModificarCajaDA modificarCajaDA,
        IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
        IErrorLogger errorLogger)
    {
        _modificarCajaDA = modificarCajaDA;
        _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
        _logger = errorLogger;
    }

    public async Task<ModeloValidacion> ModificarCaja(ModificarCajaDto dto)
    {
        try
        {
            int resultado = await _modificarCajaDA.ModificarCaja(dto);
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
            Mensaje = (resultadoRegistro > 0 ? MensajeDeCajaDto.CajaModificadaCorrectamente : MensajeDeCajaDto.CajaNoGuardada)
                      + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
            EsCorrecto = resultadoRegistro > 0,
        };
    }

    private async Task<int> AgregarEventoBitacoraCorrecto(ModificarCajaDto dto, int resultadoRegistro)
    {
        return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
        {
            descripcionDelEvento = resultadoRegistro > 0
                ? MensajeDeCajaDto.CajaModificadaCorrectamente + " no_caja: " + dto.NoCaja
                : MensajeDeCajaDto.CajaNoGuardada + " no_caja: " + dto.NoCaja,
            fechaDeRegistro = DateTime.Now,
            nombreDelMetodo = nameof(ModificarCaja),
            tabla = "Caja",
            idBitacora = Guid.NewGuid(),
            identificador = dto.Identificador,
            usuario = dto.Usuario,
        });
    }
}
