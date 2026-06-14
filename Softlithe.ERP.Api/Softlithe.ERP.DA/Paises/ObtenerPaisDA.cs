using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Paises;
using Softlithe.ERP.Abstracciones.DA.Paises;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Paises;

public class ObtenerPaisDA : IObtenerPaisDA
{
    private readonly ContextoBasedeDatos _contextoBasedeDatos;

    public ObtenerPaisDA(ContextoBasedeDatos contextoBasedeDatos)
    {
        _contextoBasedeDatos = contextoBasedeDatos;
    }

    public async Task<List<PaisDto>> ObtenerPaises(string nombreFiltro)
    {
        try
        {
            string filtro = nombreFiltro?.Trim() ?? string.Empty;

            IQueryable<PaisDto> consulta =
                from pais in _contextoBasedeDatos.Paises
                where string.IsNullOrEmpty(filtro)
                    || EF.Functions.Like(pais.Nombre ?? string.Empty, "%" + filtro + "%")
                orderby pais.Nombre
                select new PaisDto
                {
                    NoPais = pais.NoPais,
                    Nombre = pais.Nombre ?? string.Empty,
                };

            return await consulta.ToListAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Ocurrió un error al obtener los países: " + ex.Message
                + ". StackTrace: " + ex.StackTrace
                + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
        }
    }
}
