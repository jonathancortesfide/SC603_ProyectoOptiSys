using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Paises;
using Softlithe.ERP.Abstracciones.Contenedores.Paises;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Paises;

namespace Softlithe.ERP.BW.Paises;

public class ObtenerPaisBW : IObtenerPaisBW
{
    private readonly IObtenerPaisDA _obtenerPaisDa;
    private readonly IErrorLogger _logger;

    public ObtenerPaisBW(IObtenerPaisDA obtenerPaisDa, IErrorLogger errorLogger)
    {
        _obtenerPaisDa = obtenerPaisDa;
        _logger = errorLogger;
    }

    public async Task<PaisConModeloDeValidacion> ObtenerPaises(ParametroConsultaPais parametroConsultaPais)
    {
        try
        {
            List<PaisDto> lista = await _obtenerPaisDa.ObtenerPaises(parametroConsultaPais.Nombre);
            return ConstruirRespuestaExitosa(lista);
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return ConstruirRespuestaExitosa(null);
        }
    }

    private static PaisConModeloDeValidacion ConstruirRespuestaExitosa(List<PaisDto>? lista)
    {
        return new PaisConModeloDeValidacion
        {
            LaListaDePaises = lista ?? new List<PaisDto>(),
            Mensaje = lista == null
                ? MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema
                : MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
            EsCorrecto = lista != null,
        };
    }
}
