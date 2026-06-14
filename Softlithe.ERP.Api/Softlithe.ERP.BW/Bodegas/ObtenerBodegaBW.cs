using Softlithe.ERP.Abstracciones.BW.Bodegas;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.Contenedores.Bodegas;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Bodegas;

namespace Softlithe.ERP.BW.Bodegas;

public class ObtenerBodegaBW : IObtenerBodegaBW
{
    private readonly IObtenerBodegaDA _obtenerBodegaDA;
    private readonly IErrorLogger _logger;

    public ObtenerBodegaBW(IObtenerBodegaDA obtenerBodegaDA, IErrorLogger errorLogger)
    {
        _obtenerBodegaDA = obtenerBodegaDA;
        _logger = errorLogger;
    }

    public async Task<BodegaConModeloDeValidacion> ObtenerBodegas(ParametroConsultaBodega parametro)
    {
        if (parametro.NoEmpresa <= 0)
        {
            return new BodegaConModeloDeValidacion
            {
                ListaBodegas = new List<BodegaDto>(),
                Mensaje = MensajesGeneralesDelSistemaDto.CodigoEmpresaRequerida,
                EsCorrecto = false,
            };
        }

        try
        {
            List<BodegaDto> lista =
                await _obtenerBodegaDA.ObtenerBodegas(
                    parametro.NoEmpresa,
                    parametro.Descripcion,
                    parametro.IdProducto);
            return new BodegaConModeloDeValidacion
            {
                ListaBodegas = lista,
                Mensaje = MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = true,
            };
        }
        catch (Exception ex)
        {
            await _logger.RegistrarEventoError(ex);
            return new BodegaConModeloDeValidacion
            {
                ListaBodegas = new List<BodegaDto>(),
                Mensaje = MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema,
                EsCorrecto = false,
            };
        }
    }
}
