using Softlithe.ERP.Abstracciones.Contenedores;

namespace Softlithe.ERP.Abstracciones.Contenedores.ActividadEconomicaHacienda
{
    public class ActividadEconomicaHaciendaDto
    {
        public string CodigoActividad { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
    }

    public class ActividadEcoHaciendaConModeloDeValidacion : ModeloValidacion
    {
        public List<ActividadEconomicaHaciendaDto> ListaActividadesEconomicas { get; set; } = new List<ActividadEconomicaHaciendaDto>();
    }
}
