using Softlithe.ERP.Abstracciones.BW.ActividadEconomicaHacienda;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.Contenedores.ActividadEconomicaHacienda;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.ActividadEconomicaHacienda;

namespace Softlithe.ERP.BW.ActividadEconomicaHacienda
{
    public class ObtenerActividadEconomicaHaciendaBW : IObtenerActividadEconomicaHaciendaBW
    {
        private readonly IObtenerActividadEconomicaHaciendaDA _obtenerActividadEconomicaHaciendaDA;
        private readonly IErrorLogger _logger;

        public ObtenerActividadEconomicaHaciendaBW(IObtenerActividadEconomicaHaciendaDA obtenerActividadEconomicaHaciendaDA, IErrorLogger errorLogger)
        {
            _obtenerActividadEconomicaHaciendaDA = obtenerActividadEconomicaHaciendaDA;
            _logger = errorLogger;
        }

        public async Task<ActividadEcoHaciendaConModeloDeValidacion> ObtenerActividadEconomicaHacienda(string? textoBusqueda = null)
        {
            try
            {
                List<ActividadEconomicaHaciendaDto> lista = await _obtenerActividadEconomicaHaciendaDA.ObtenerActividadesEconomicasHacienda(textoBusqueda);
                return new ActividadEcoHaciendaConModeloDeValidacion
                {
                    ListaActividadesEconomicas = lista,
                    Mensaje = MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                    EsCorrecto = true,
                };
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return new ActividadEcoHaciendaConModeloDeValidacion
                {
                    ListaActividadesEconomicas = new List<ActividadEconomicaHaciendaDto>(),
                    Mensaje = MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema,
                    EsCorrecto = false,
                };
            }
        }
    }
}
