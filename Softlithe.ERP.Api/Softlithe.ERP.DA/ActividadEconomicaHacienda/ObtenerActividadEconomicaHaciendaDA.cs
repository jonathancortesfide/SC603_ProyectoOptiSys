using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.ActividadEconomicaHacienda;
using Softlithe.ERP.Abstracciones.DA.ActividadEconomicaHacienda;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.ActividadEconomicaHacienda
{
    public class ObtenerActividadEconomicaHaciendaDA : IObtenerActividadEconomicaHaciendaDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public ObtenerActividadEconomicaHaciendaDA(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contexto = contextoBasedeDatos;
        }

        public async Task<List<ActividadEconomicaHaciendaDto>> ObtenerActividadesEconomicasHacienda(string? textoBusqueda = null)
        {
            try
            {
                var query = _contexto.ActividadEconomicaHaciendas
                    .AsNoTracking()
                    .Where(x => x.Activo == true);

                if (!string.IsNullOrWhiteSpace(textoBusqueda))
                {
                    var term = textoBusqueda.Trim();
                    query = query.Where(x =>
                        x.CodigoActividad.Contains(term)
                        || (x.Descripcion != null && x.Descripcion.Contains(term)));
                }

                return await query
                    .OrderBy(x => x.CodigoActividad)
                    .Select(x => new ActividadEconomicaHaciendaDto
                    {
                        CodigoActividad = x.CodigoActividad,
                        Descripcion = x.Descripcion,
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al obtener el catálogo de actividades económicas de Hacienda: " + ex.Message + ". StackTrace: " + ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
            }
        }
    }
}
