using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Cajas;
using Softlithe.ERP.Abstracciones.DA.Cajas;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Cajas;

public class ModificarEstadoCajaDA : IModificarEstadoCajaDA
{
    private readonly ContextoBasedeDatos _contexto;

    public ModificarEstadoCajaDA(ContextoBasedeDatos contexto)
    {
        _contexto = contexto;
    }

    public async Task<RespuestaCambiarEstadoCajaDA> ModificarEstadoCaja(ModificarEstadoCajaDto dto)
    {
        if (dto == null)
        {
            throw new ArgumentNullException(nameof(dto));
        }

        await using IDbContextTransaction transaction = await _contexto.Database.BeginTransactionAsync();

        try
        {
            Caja? existente = await _contexto.Cajas.FindAsync(dto.NoCaja);

            if (existente == null)
            {
                return new RespuestaCambiarEstadoCajaDA
                {
                    ModeloCaja = new CajaDto(),
                    ResultadoRegistro = 0,
                };
            }

            existente.Activo = dto.EsActivo;
            if (!dto.EsActivo)
            {
                existente.ValorPorDefecto = false;
            }

            if (dto.EsActivo && existente.ValorPorDefecto)
            {
                await CajaValorPorDefectoSoporte.QuitarOtrosPorDefecto(_contexto, dto.Identificador, existente.NoCaja);
            }

            _contexto.Cajas.Update(existente);
            int resultadoRegistro = await _contexto.SaveChangesAsync();
            await transaction.CommitAsync();

            return new RespuestaCambiarEstadoCajaDA
            {
                ResultadoRegistro = resultadoRegistro,
                ModeloCaja = new CajaDto
                {
                    NoCaja = existente.NoCaja,
                    Nombre = existente.Nombre ?? string.Empty,
                    Identificador = dto.Identificador,
                    EsActivo = existente.Activo,
                    EsPorDefecto = existente.ValorPorDefecto,
                },
            };
        }
        catch (DbUpdateException dbEx)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar el estado de la caja en la base de datos.", dbEx);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar el estado de la caja.", ex);
        }
    }
}
