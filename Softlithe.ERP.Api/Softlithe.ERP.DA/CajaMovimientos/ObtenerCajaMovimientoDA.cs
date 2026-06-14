using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.CajaMovimientos;
using Softlithe.ERP.Abstracciones.DA.CajaMovimientos;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.CajaMovimientos;

public class ObtenerCajaMovimientoDA : IObtenerCajaMovimientoDA
{
    private const string EstadoAbierta = "ABIERTA";

    private readonly ContextoBasedeDatos _contexto;

    public ObtenerCajaMovimientoDA(ContextoBasedeDatos contexto)
    {
        _contexto = contexto;
    }

    public async Task<List<CajaMovimientoDto>> ObtenerMovimientos(int idCierre)
    {
        try
        {
            return await (
                from movimiento in _contexto.CajaMovimientos.AsNoTracking()
                join tipo in _contexto.TiposMovimientoCaja.AsNoTracking()
                    on movimiento.NoTipoMovimiento equals tipo.NoTipoMovimiento
                join formaPago in _contexto.FormasPago.AsNoTracking()
                    on movimiento.NoFormaPago equals formaPago.NoFormaPago into formasPago
                from formaPago in formasPago.DefaultIfEmpty()
                where movimiento.IdCierre == idCierre
                orderby movimiento.FechaRegistro descending
                select new CajaMovimientoDto
                {
                    IdMovimiento = movimiento.IdMovimiento,
                    IdCierre = movimiento.IdCierre,
                    NoTipoMovimiento = movimiento.NoTipoMovimiento,
                    NombreTipoMovimiento = tipo.NombreMovimiento,
                    NoFormaPago = movimiento.NoFormaPago,
                    NombreFormaPago = formaPago != null ? formaPago.Nombre : null,
                    NoMoneda = movimiento.NoMoneda,
                    Monto = movimiento.Monto,
                    Concepto = movimiento.Concepto,
                    FechaRegistro = movimiento.FechaRegistro,
                    IdUsuario = movimiento.IdUsuario,
                    IdDocumentoOrigen = movimiento.IdDocumentoOrigen,
                    TipoDocumentoOrigen = movimiento.TipoDocumentoOrigen,
                }).ToListAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Ocurrió un error al obtener los movimientos de caja: " + ex.Message + ". StackTrace: " + ex.StackTrace +
                ". Mensaje Inner Exception: " + ex.InnerException?.Message);
        }
    }

    public async Task<CajaCierreDto?> ObtenerCierreActivo(int noCaja, int identificador)
    {
        try
        {
            return await (
                from cierre in _contexto.CajaCierres.AsNoTracking()
                join caja in _contexto.Cajas.AsNoTracking()
                    on cierre.NoCaja equals caja.NoCaja
                where cierre.NoCaja == noCaja
                      && cierre.Identificador == identificador
                      && cierre.Estado == EstadoAbierta
                orderby cierre.FechaApertura descending
                select new CajaCierreDto
                {
                    IdCierre = cierre.IdCierre,
                    NoCierre = cierre.NoCierre,
                    NoCaja = cierre.NoCaja,
                    NombreCaja = caja.Nombre,
                    Estado = cierre.Estado,
                    Identificador = cierre.Identificador,
                    FechaApertura = cierre.FechaApertura,
                    FechaCierre = cierre.FechaCierre,
                    IdUsuarioApertura = cierre.IdUsuarioApertura,
                    MontoApertura = cierre.MontoApertura,
                    Observaciones = cierre.Observaciones,
                }).FirstOrDefaultAsync();
        }
        catch (Exception ex)
        {
            throw new Exception(
                "Ocurrió un error al obtener el cierre activo de caja: " + ex.Message + ". StackTrace: " +
                ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
        }
    }
}
