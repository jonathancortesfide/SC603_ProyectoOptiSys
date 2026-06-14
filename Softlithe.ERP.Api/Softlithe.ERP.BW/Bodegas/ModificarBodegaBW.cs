using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Bodegas;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Bodegas;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Bodegas;

namespace Softlithe.ERP.BW.Bodegas;

public class ModificarBodegaBW : IModificarBodegaBW
{
    private readonly IModificarBodegaDA _modificarBodegaDA;
    private readonly IObtenerBodegaDA _obtenerBodegaDA;
    private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
    private readonly IErrorLogger _logger;

    public ModificarBodegaBW(
        IModificarBodegaDA modificarBodegaDA,
        IObtenerBodegaDA obtenerBodegaDA,
        IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
        IErrorLogger errorLogger)
    {
        _modificarBodegaDA = modificarBodegaDA;
        _obtenerBodegaDA = obtenerBodegaDA;
        _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
        _logger = errorLogger;
    }

    public async Task<ModeloValidacion> ModificarBodega(ModificarBodegaDto dto)
    {
        try
        {
            int resultado = await _modificarBodegaDA.ModificarBodega(dto);
            int? identificador = resultado > 0 ? await _obtenerBodegaDA.ObtenerIdentificadorPorNoBodega(dto.NoBodega) : null;
            int respuestaBitacora = await AgregarEventoBitacoraCorrecto(dto, resultado, identificador ?? 0);
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
            Mensaje = (resultadoRegistro > 0 ? MensajeDeBodegaDto.BodegaModificadaCorrectamente : MensajeDeBodegaDto.BodegaNoGuardada)
                      + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
            EsCorrecto = resultadoRegistro > 0,
        };
    }

    private async Task<int> AgregarEventoBitacoraCorrecto(ModificarBodegaDto dto, int resultadoRegistro, int identificador)
    {
        return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
        {
            descripcionDelEvento = resultadoRegistro > 0
                ? MensajeDeBodegaDto.BodegaModificadaCorrectamente + " Descripción: " + dto.Descripcion
                : MensajeDeBodegaDto.BodegaNoGuardada + " Descripción: " + dto.Descripcion,
            fechaDeRegistro = DateTime.Now,
            nombreDelMetodo = nameof(ModificarBodega),
            tabla = "Bodega",
            idBitacora = Guid.NewGuid(),
            identificador = identificador,
            usuario = dto.Usuario,
        });
    }
}
