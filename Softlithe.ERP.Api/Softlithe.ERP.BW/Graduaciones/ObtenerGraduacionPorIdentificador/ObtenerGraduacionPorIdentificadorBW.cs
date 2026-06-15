using Softlithe.ERP.Abstracciones.BW.Graduaciones.ObtenerGraduacionPorIdentificador;
using Softlithe.ERP.Abstracciones.Contenedores.Graduaciones;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Graduaciones.ObtenerGraduacionPorIdentificador;

namespace Softlithe.ERP.BW.Graduaciones.ObtenerGraduacionPorIdentificador;

public class ObtenerGraduacionPorIdentificadorBW : IObtenerGraduacionPorIdentificadorBW
{
    private readonly IObtenerGraduacionPorIdentificadorAD _obtenerGraduacionPorIdentificadorAD;

    public ObtenerGraduacionPorIdentificadorBW(IObtenerGraduacionPorIdentificadorAD obtenerGraduacionPorIdentificadorAD)
    {
        _obtenerGraduacionPorIdentificadorAD = obtenerGraduacionPorIdentificadorAD;
    }

    public async Task<GraduacionConModeloDeValidacion> Obtener(int identificador)
    {
        try
        {
            GraduacionAgrupadaDto agrupado = await _obtenerGraduacionPorIdentificadorAD.Obtener(identificador);
            return new GraduacionConModeloDeValidacion
            {
                TiposGraduacion = agrupado.TiposGraduacion,
                Mensaje = MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = true
            };
        }
        catch (Exception)
        {
            return new GraduacionConModeloDeValidacion
            {
                TiposGraduacion = new List<TipoGraduacionDto>(),
                Mensaje = MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema,
                EsCorrecto = false
            };
        }
    }
}
