using Softlithe.ERP.Abstracciones.Contenedores.ActividadEconomicaHacienda;

namespace Softlithe.ERP.Abstracciones.BW.ActividadEconomicaHacienda
{
    public interface IObtenerActividadEconomicaHaciendaBW
    {
        Task<ActividadEcoHaciendaConModeloDeValidacion> ObtenerActividadEconomicaHacienda(string? textoBusqueda = null);
    }
}
