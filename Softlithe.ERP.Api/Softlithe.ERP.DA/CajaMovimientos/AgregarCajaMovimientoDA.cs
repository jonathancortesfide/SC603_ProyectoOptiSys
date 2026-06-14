using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.CajaMovimientos;
using Softlithe.ERP.Abstracciones.DA.CajaMovimientos;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.CajaMovimientos;

public class AgregarCajaMovimientoDA : IAgregarCajaMovimientoDA
{
    private const string EstadoAbierta = "ABIERTA";

    private readonly ContextoBasedeDatos _contexto;

    public AgregarCajaMovimientoDA(ContextoBasedeDatos contexto)
    {
        _contexto = contexto;
    }

    public async Task<int> AgregarMovimiento(AgregarCajaMovimientoDto dto)
    {
        if (dto == null)
        {
            throw new ArgumentNullException(nameof(dto));
        }

        await using IDbContextTransaction transaction = await _contexto.Database.BeginTransactionAsync();

        try
        {
            CajaCierre? cierre = await _contexto.CajaCierres
                .FirstOrDefaultAsync(c =>
                    c.IdCierre == dto.IdCierre
                    && c.Identificador == dto.Identificador
                    && c.Estado == EstadoAbierta);

            if (cierre == null)
            {
                return 0;
            }

            var entidad = new CajaMovimiento
            {
                IdCierre = dto.IdCierre,
                NoTipoMovimiento = dto.NoTipoMovimiento,
                NoFormaPago = dto.NoFormaPago,
                NoMoneda = dto.NoMoneda,
                Monto = dto.Monto,
                Concepto = dto.Concepto,
                FechaRegistro = DateTime.Now,
                IdUsuario = dto.IdUsuario,
                IdDocumentoOrigen = dto.IdDocumentoOrigen,
                TipoDocumentoOrigen = dto.TipoDocumentoOrigen,
            };

            await _contexto.CajaMovimientos.AddAsync(entidad);
            int resultadoRegistro = await _contexto.SaveChangesAsync();
            await transaction.CommitAsync();

            return resultadoRegistro;
        }
        catch (DbUpdateException dbEx)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al guardar el movimiento de caja en la base de datos.", dbEx);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al guardar el movimiento de caja.", ex);
        }
    }
}
