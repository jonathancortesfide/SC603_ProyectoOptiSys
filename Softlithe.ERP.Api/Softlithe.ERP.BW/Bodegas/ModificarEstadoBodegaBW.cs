using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Bodegas;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Bodegas;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Bodegas;

namespace Softlithe.ERP.BW.Bodegas;

public class ModificarEstadoBodegaBW : IModificarEstadoBodegaBW
{
    private readonly IModificarEstadoBodegaDA _modificarEstadoBodegaDA;
    private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
    private readonly IErrorLogger _logger;

    public ModificarEstadoBodegaBW(
        IModificarEstadoBodegaDA modificarEstadoBodegaDA,
        IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
        IErrorLogger errorLogger)
    {
        _modificarEstadoBodegaDA = modificarEstadoBodegaDA;
        _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
        _logger = errorLogger;
    }

    public async Task<ModeloValidacion> ModificarEstadoBodega(ModificarEstadoBodegaDto dto)
    {
        RespuestaCambiarEstadoBodegaDA resultado = new RespuestaCambiarEstadoBodegaDA
        {
            ResultadoRegistro = 0,
            ModeloBodega = new BodegaDto(),
        };

        try
        {
            resultado = await _modificarEstadoBodegaDA.ModificarEstadoBodega(dto);
            int respuestaBitacora = await AgregarEventoBitacoraCorrecto(resultado, dto.Usuario);
            return ConstruirRespuestaExitosa(resultado, respuestaBitacora);
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return ConstruirRespuestaExitosa(resultado, 1);
        }
    }

    private ModeloValidacion ConstruirRespuestaExitosa(RespuestaCambiarEstadoBodegaDA respuesta, int errorBitacora)
    {
        bool ok = respuesta.ResultadoRegistro > 0;
        string mensajeOk = string.Format(
            MensajeDeBodegaDto.BodegaEstadoModificadoCorrectamente,
            respuesta.ModeloBodega.Descripcion,
            respuesta.ModeloBodega.EsActivo ? "Activo" : "Inactivo");

        return new ModeloValidacion
        {
            Mensaje = (ok ? mensajeOk : MensajeDeBodegaDto.BodegaNoGuardada)
                      + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
            EsCorrecto = ok,
        };
    }

    private async Task<int> AgregarEventoBitacoraCorrecto(RespuestaCambiarEstadoBodegaDA resultado, string usuario)
    {
        bool ok = resultado.ResultadoRegistro > 0;
        string mensajeOk = string.Format(
            MensajeDeBodegaDto.BodegaEstadoModificadoCorrectamente,
            resultado.ModeloBodega.Descripcion,
            resultado.ModeloBodega.EsActivo ? "Activo" : "Inactivo");

        return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
        {
            descripcionDelEvento = ok ? mensajeOk : MensajeDeBodegaDto.BodegaNoGuardada,
            fechaDeRegistro = DateTime.Now,
            nombreDelMetodo = nameof(ModificarEstadoBodega),
            tabla = "Bodega",
            idBitacora = Guid.NewGuid(),
            identificador = resultado.ModeloBodega.Identificador,
            usuario = usuario,
        });
    }
}
