using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.CajaMovimientos;
using Softlithe.ERP.Abstracciones.DA.CajaMovimientos;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.CajaMovimientos;

public class AperturaCajaDA : IAperturaCajaDA
{
    private const string EstadoAbierta = "ABIERTA";
    private const string AbreviaturaApertura = "APERTURA";

    private readonly ContextoBasedeDatos _contexto;

    public AperturaCajaDA(ContextoBasedeDatos contexto)
    {
        _contexto = contexto;
    }

    public async Task<AperturaCajaConModeloDeValidacion> AperturarCaja(AperturaCajaDto dto)
    {
        if (dto == null)
        {
            throw new ArgumentNullException(nameof(dto));
        }

        await using IDbContextTransaction transaction = await _contexto.Database.BeginTransactionAsync();

        try
        {
            Caja? caja = await _contexto.Cajas
                .FirstOrDefaultAsync(c =>
                    c.NoCaja == dto.NoCaja
                    && c.Identificador == dto.Identificador);

            if (caja == null)
            {
                return RespuestaFallida(MensajeDeCajaMovimientoDto.CajaNoEncontrada);
            }

            if (!caja.Activo)
            {
                return RespuestaFallida(MensajeDeCajaMovimientoDto.CajaInactiva);
            }

            bool existeCierreActivo = await _contexto.CajaCierres
                .AsNoTracking()
                .AnyAsync(c =>
                    c.NoCaja == dto.NoCaja
                    && c.Identificador == dto.Identificador
                    && c.Estado == EstadoAbierta);

            if (existeCierreActivo)
            {
                return RespuestaFallida(MensajeDeCajaMovimientoDto.CierreActivoExistente);
            }

            int siguienteNoCierre = await _contexto.CajaCierres
                .AsNoTracking()
                .Where(c => c.NoCaja == dto.NoCaja)
                .Select(c => (int?)c.NoCierre)
                .MaxAsync() ?? 0;
            siguienteNoCierre += 1;

            DateTime fechaApertura = DateTime.Now;
            var cierre = new CajaCierre
            {
                NoCierre = siguienteNoCierre,
                NoCaja = dto.NoCaja,
                Estado = EstadoAbierta,
                Identificador = dto.Identificador,
                FechaApertura = fechaApertura,
                IdUsuario = dto.IdUsuario,
                IdUsuarioApertura = dto.IdUsuario,
                MontoApertura = dto.MontoApertura,
                Observaciones = dto.Observaciones,
            };

            await _contexto.CajaCierres.AddAsync(cierre);
            await _contexto.SaveChangesAsync();

            int noTipoMovimiento = await ResolverTipoMovimientoApertura(dto.NoTipoMovimiento);
            if (noTipoMovimiento <= 0)
            {
                await transaction.RollbackAsync();
                _contexto.ChangeTracker.Clear();
                return RespuestaFallida(MensajeDeCajaMovimientoDto.TipoMovimientoAperturaNoEncontrado);
            }

            var movimiento = new CajaMovimiento
            {
                IdCierre = cierre.IdCierre,
                NoTipoMovimiento = noTipoMovimiento,
                NoFormaPago = dto.NoFormaPago,
                NoMoneda = dto.NoMoneda,
                Monto = dto.MontoApertura,
                Concepto = string.IsNullOrWhiteSpace(dto.Concepto)
                    ? "Apertura de caja"
                    : dto.Concepto,
                FechaRegistro = fechaApertura,
                IdUsuario = dto.IdUsuario,
            };

            await _contexto.CajaMovimientos.AddAsync(movimiento);
            await _contexto.SaveChangesAsync();
            await transaction.CommitAsync();

            return new AperturaCajaConModeloDeValidacion
            {
                EsCorrecto = true,
                Mensaje = MensajeDeCajaMovimientoDto.AperturaRealizadaCorrectamente,
                IdCierre = cierre.IdCierre,
                NoCierre = cierre.NoCierre,
                IdMovimiento = movimiento.IdMovimiento,
            };
        }
        catch (DbUpdateException dbEx)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al realizar la apertura de caja en la base de datos.", dbEx);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al realizar la apertura de caja.", ex);
        }
    }

    private async Task<int> ResolverTipoMovimientoApertura(int? noTipoMovimiento)
    {
        if (noTipoMovimiento.HasValue && noTipoMovimiento.Value > 0)
        {
            bool existe = await _contexto.TiposMovimientoCaja
                .AsNoTracking()
                .AnyAsync(t => t.NoTipoMovimiento == noTipoMovimiento.Value);

            return existe ? noTipoMovimiento.Value : 0;
        }

        int? porAbreviatura = await _contexto.TiposMovimientoCaja
            .AsNoTracking()
            .Where(t => t.Abreviatura == AbreviaturaApertura)
            .Select(t => (int?)t.NoTipoMovimiento)
            .FirstOrDefaultAsync();

        if (porAbreviatura.HasValue)
        {
            return porAbreviatura.Value;
        }

        return await _contexto.TiposMovimientoCaja
            .AsNoTracking()
            .Where(t =>
                t.Naturaleza == "ENTRADA"
                && (t.NombreMovimiento ?? string.Empty).Contains("Apertura"))
            .Select(t => t.NoTipoMovimiento)
            .FirstOrDefaultAsync();
    }

    private static AperturaCajaConModeloDeValidacion RespuestaFallida(string mensaje)
    {
        return new AperturaCajaConModeloDeValidacion
        {
            EsCorrecto = false,
            Mensaje = mensaje,
        };
    }
}
