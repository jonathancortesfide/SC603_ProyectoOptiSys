using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Vendedores;
using Softlithe.ERP.Abstracciones.DA.Vendedores;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Vendedores;

public class ObtenerVendedorDA : IObtenerVendedorDA
{
    private readonly ContextoBasedeDatos _contexto;

    public ObtenerVendedorDA(ContextoBasedeDatos contexto)
    {
        _contexto = contexto;
    }

    public async Task<List<VendedorDto>> ObtenerVendedores(int identificador, string? descripcion)
    {
        try
        {
            IQueryable<Vendedor> consulta = _contexto.Vendedores.AsNoTracking()
                .Where(v => v.Identificador == identificador && v.Activo);

            if (!string.IsNullOrWhiteSpace(descripcion))
            {
                consulta = consulta.Where(v =>
                    EF.Functions.Like(v.Descripcion ?? string.Empty, "%" + descripcion + "%"));
            }

            return await consulta
                .OrderBy(v => v.Descripcion)
                .Select(v => new VendedorDto
                {
                    NoVendedor = v.NoVendedor,
                    Descripcion = v.Descripcion ?? string.Empty,
                    Identificador = v.Identificador,
                    IdUsuario = v.IdUsuario,
                    EsActivo = v.Activo,
                })
                .ToListAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Ocurrió un error al obtener los vendedores: " + ex.Message + ". StackTrace: " + ex.StackTrace +
                ". Mensaje Inner Exception: " + ex.InnerException?.Message);
        }
    }

    public async Task<VendedorDto?> ObtenerVendedorPorUsuario(int identificador, int idUsuario)
    {
        try
        {
            return await _contexto.Vendedores.AsNoTracking()
                .Where(v =>
                    v.Identificador == identificador
                    && v.IdUsuario == idUsuario
                    && v.Activo)
                .OrderBy(v => v.NoVendedor)
                .Select(v => new VendedorDto
                {
                    NoVendedor = v.NoVendedor,
                    Descripcion = v.Descripcion ?? string.Empty,
                    Identificador = v.Identificador,
                    IdUsuario = v.IdUsuario,
                    EsActivo = v.Activo,
                })
                .FirstOrDefaultAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Ocurrió un error al obtener el vendedor por usuario: " + ex.Message + ". StackTrace: " +
                ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
        }
    }
}
