using Softlithe.ERP.Abstracciones.Contenedores.ActividadEconomicaHacienda;

namespace Softlithe.ERP.Abstracciones.DA.ActividadEconomicaHacienda
{
    public interface IObtenerActividadEconomicaHaciendaDA
    {
        Task<List<ActividadEconomicaHaciendaDto>> ObtenerActividadesEconomicasHacienda(string? textoBusqueda = null);
    }
}
