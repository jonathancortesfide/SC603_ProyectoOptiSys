using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Cajas;
using Softlithe.ERP.Abstracciones.DA.Cajas;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Cajas;

public class ObtenerCajaDA : IObtenerCajaDA
{
    private readonly ContextoBasedeDatos _contexto;

    public ObtenerCajaDA(ContextoBasedeDatos contexto)
    {
        _contexto = contexto;
    }

    public async Task<List<CajaDto>> ObtenerCajas(int identificador, string? nombre, bool soloActivas)
    {
        try
        {
            IQueryable<Caja> consulta = _contexto.Cajas.AsNoTracking()
                .Where(c => c.Identificador == identificador);

            if (soloActivas)
            {
                consulta = consulta.Where(c => c.Activo);
            }

            if (!string.IsNullOrWhiteSpace(nombre))
            {
                consulta = consulta.Where(c =>
                    EF.Functions.Like(c.Nombre ?? string.Empty, "%" + nombre + "%"));
            }

            return await consulta
                .OrderByDescending(c => c.ValorPorDefecto)
                .ThenBy(c => c.Nombre)
                .Select(c => new CajaDto
                {
                    NoCaja = c.NoCaja,
                    Nombre = c.Nombre ?? string.Empty,
                    Identificador = c.Identificador,
                    EsActivo = c.Activo,
                    EsPorDefecto = c.ValorPorDefecto,
                })
                .ToListAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Ocurrió un error al obtener las cajas: " + ex.Message + ". StackTrace: " + ex.StackTrace +
                ". Mensaje Inner Exception: " + ex.InnerException?.Message);
        }
    }
}
