using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Bodegas;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Bodegas;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Bodegas;

namespace Softlithe.ERP.BW.Bodegas;

public class AgregarBodegaBW : IAgregarBodegaBW
{
    private readonly IAgregarBodegaDA _agregarBodegaDA;
    private readonly IObtenerBodegaDA _obtenerBodegaDA;
    private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
    private readonly IErrorLogger _logger;

    public AgregarBodegaBW(
        IAgregarBodegaDA agregarBodegaDA,
        IObtenerBodegaDA obtenerBodegaDA,
        IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
        IErrorLogger errorLogger)
    {
        _agregarBodegaDA = agregarBodegaDA;
        _obtenerBodegaDA = obtenerBodegaDA;
        _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
        _logger = errorLogger;
    }

    public async Task<ModeloValidacion> AgregarBodega(AgregarBodegaDto dto)
    {
        try
        {
            int resultado = await _agregarBodegaDA.AgregarBodega(dto);
            int? identificadorBitacora = resultado > 0
                ? await _obtenerBodegaDA.ObtenerIdentificadorPorNoEmpresa(dto.NoEmpresa)
                : null;
            int respuestaBitacora = await AgregarEventoBitacoraCorrecto(dto, resultado, identificadorBitacora ?? 0);
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
            Mensaje = (resultadoRegistro > 0 ? MensajeDeBodegaDto.BodegaAgregadaCorrectamente : MensajeDeBodegaDto.BodegaNoGuardada)
                      + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
            EsCorrecto = resultadoRegistro > 0,
        };
    }

    private async Task<int> AgregarEventoBitacoraCorrecto(AgregarBodegaDto dto, int resultadoRegistro, int identificador)
    {
        return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
        {
            descripcionDelEvento = resultadoRegistro > 0
                ? MensajeDeBodegaDto.BodegaAgregadaCorrectamente + " Descripción: " + dto.Descripcion
                : MensajeDeBodegaDto.BodegaNoGuardada + " Descripción: " + dto.Descripcion,
            fechaDeRegistro = DateTime.Now,
            nombreDelMetodo = nameof(AgregarBodega),
            tabla = "Bodega",
            idBitacora = Guid.NewGuid(),
            identificador = identificador,
            usuario = dto.Usuario,
        });
    }
}
