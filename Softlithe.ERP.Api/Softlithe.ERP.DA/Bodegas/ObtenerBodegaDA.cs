using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Bodegas;
using Softlithe.ERP.Abstracciones.DA.Bodegas;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Bodegas;

public class ObtenerBodegaDA : IObtenerBodegaDA
{
    private readonly ContextoBasedeDatos _contexto;

    public ObtenerBodegaDA(ContextoBasedeDatos contextoBasedeDatos)
    {
        _contexto = contextoBasedeDatos;
    }

    public async Task<List<BodegaDto>> ObtenerBodegas(int noEmpresa, string? descripcion, int? idProducto)
    {
        try
        {
            IQueryable<Bodega> consulta = _contexto.Bodegas.AsNoTracking()
                .Where(b => b.NoEmpresa == noEmpresa);

            if (!string.IsNullOrWhiteSpace(descripcion))
            {
                consulta = consulta.Where(b =>
                    EF.Functions.Like(b.Descripcion ?? string.Empty, "%" + descripcion + "%"));
            }

            if (idProducto is > 0)
            {
                int idp = idProducto.Value;
                List<BodegaDto> listaConExistencia = await (
                    from b in consulta
                    join eb in _contexto.ExistenciasBodega.AsNoTracking()
                            .Where(e => e.IdProducto == idp && e.NoEmpresa == noEmpresa)
                        on b.NoBodega equals eb.NoBodega into ebJoin
                    from eb in ebJoin.DefaultIfEmpty()
                    orderby b.Descripcion
                    select new BodegaDto
                    {
                        NoBodega = b.NoBodega,
                        Descripcion = b.Descripcion ?? string.Empty,
                        NoEmpresa = b.NoEmpresa,
                        EsActivo = b.Activo,
                        Existencia = eb != null ? eb.Existencia : null,
                    }).ToListAsync();

                return listaConExistencia;
            }

            List<BodegaDto> lista = await consulta
                .OrderBy(b => b.Descripcion)
                .Select(b => new BodegaDto
                {
                    NoBodega = b.NoBodega,
                    Descripcion = b.Descripcion ?? string.Empty,
                    NoEmpresa = b.NoEmpresa,
                    EsActivo = b.Activo,
                    Existencia = null,
                })
                .ToListAsync();

            return lista;
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Ocurrió un error al obtener las bodegas: " + ex.Message + ". StackTrace: " + ex.StackTrace +
                ". Mensaje Inner Exception: " + ex.InnerException?.Message);
        }
    }

    public async Task<int?> ObtenerIdentificadorPorNoBodega(int noBodega)
    {
        try
        {
            int identificador = await (
                from b in _contexto.Bodegas.AsNoTracking()
                join es in _contexto.EmpresaSucursales.AsNoTracking() on b.NoEmpresa equals es.NoEmpresa
                where b.NoBodega == noBodega
                orderby es.Identificador
                select es.Identificador).FirstOrDefaultAsync();

            return identificador == 0 ? null : identificador;
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Ocurrió un error al resolver el identificador de la bodega: " + ex.Message + ". StackTrace: " +
                ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
        }
    }

    public async Task<int?> ObtenerIdentificadorPorNoEmpresa(int noEmpresa)
    {
        try
        {
            int identificador = await _contexto.EmpresaSucursales.AsNoTracking()
                .Where(es => es.NoEmpresa == noEmpresa)
                .OrderBy(es => es.Identificador)
                .Select(es => es.Identificador)
                .FirstOrDefaultAsync();

            return identificador == 0 ? null : identificador;
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Ocurrió un error al resolver el identificador por empresa: " + ex.Message + ". StackTrace: " +
                ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
        }
    }
}
