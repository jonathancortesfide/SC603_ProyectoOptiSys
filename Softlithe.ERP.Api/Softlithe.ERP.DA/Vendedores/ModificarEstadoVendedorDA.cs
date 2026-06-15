using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Vendedores;
using Softlithe.ERP.Abstracciones.DA.Vendedores;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Vendedores;

public class ModificarEstadoVendedorDA : IModificarEstadoVendedorDA
{
    private readonly ContextoBasedeDatos _contexto;

    public ModificarEstadoVendedorDA(ContextoBasedeDatos contexto)
    {
        _contexto = contexto;
    }

    public async Task<RespuestaCambiarEstadoVendedorDA> ModificarEstadoVendedor(ModificarEstadoVendedorDto dto)
    {
        if (dto == null)
        {
            throw new ArgumentNullException(nameof(dto));
        }

        await using IDbContextTransaction transaction = await _contexto.Database.BeginTransactionAsync();

        try
        {
            Vendedor? existente = await _contexto.Vendedores.FindAsync(dto.NoVendedor);

            if (existente == null)
            {
                return new RespuestaCambiarEstadoVendedorDA
                {
                    ModeloVendedor = new VendedorDto(),
                    ResultadoRegistro = 0,
                };
            }

            existente.Activo = dto.EsActivo;
            _contexto.Vendedores.Update(existente);
            int resultadoRegistro = await _contexto.SaveChangesAsync();
            await transaction.CommitAsync();

            return new RespuestaCambiarEstadoVendedorDA
            {
                ResultadoRegistro = resultadoRegistro,
                ModeloVendedor = new VendedorDto
                {
                    NoVendedor = existente.NoVendedor,
                    Descripcion = existente.Descripcion ?? string.Empty,
                    Identificador = dto.Identificador,
                    IdUsuario = existente.IdUsuario,
                    EsActivo = existente.Activo,
                },
            };
        }
        catch (DbUpdateException dbEx)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar el estado del vendedor en la base de datos.", dbEx);
        }
        catch (Exception ex)
        {
            await transaction.RollbackAsync();
            _contexto.ChangeTracker.Clear();
            throw new Exception("Ocurrió un error al modificar el estado del vendedor.", ex);
        }
    }
}
