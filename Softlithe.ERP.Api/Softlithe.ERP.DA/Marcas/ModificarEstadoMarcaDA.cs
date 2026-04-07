using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Marcas;
using Softlithe.ERP.Abstracciones.DA.Marcas;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Marcas
{
    public class ModificarEstadoMarcaDA : IModificarEstadoMarcaDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;
        public ModificarEstadoMarcaDA(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }

        private static RespuestaCambiarEstadoMarcaDA ObtenerMarca(Marca marcaDa, int identificador)
        {
            if (marcaDa != null)
            {
                return new RespuestaCambiarEstadoMarcaDA()
                {
                    ModeloMarca = new MarcaDto()
                    {
                        NoMarca = marcaDa.NoMarca,
                        Descripcion = marcaDa.Descripcion ?? string.Empty,
                        EsActivo = marcaDa.EsActivo,
                        Identificador = identificador,
                    },
                    ResultadoRegistro = 0
                };
            }
            return null!;
        }

        public async Task<RespuestaCambiarEstadoMarcaDA> ModificaEstadoMarca(MarcaInActivaDto elMarca)
        {
            if (elMarca == null) throw new ArgumentNullException(nameof(elMarca));
            await using IDbContextTransaction transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();
            try
            {
                Marca? marcaExistente = await _contextoBasedeDatos.Marcas.FindAsync(elMarca.NoMarca);
                RespuestaCambiarEstadoMarcaDA? resultado = ObtenerMarca(marcaExistente!, elMarca.Identificador);

                if (marcaExistente == null)
                {
                    return new RespuestaCambiarEstadoMarcaDA
                    {
                        ModeloMarca = new MarcaDto(),
                        ResultadoRegistro = 0
                    };
                }

                marcaExistente.EsActivo = elMarca.EsActivo;
                _contextoBasedeDatos.Marcas.Update(marcaExistente);
                int resultadoRegistro = await _contextoBasedeDatos.SaveChangesAsync();
                await transaction.CommitAsync();

                resultado.ResultadoRegistro = resultadoRegistro;
                resultado.ModeloMarca.EsActivo = marcaExistente.EsActivo;

                return resultado;
            }
            catch (DbUpdateException dbEx)
            {
                await transaction.RollbackAsync();
                _contextoBasedeDatos.ChangeTracker.Clear();
                throw new Exception("Ocurrió un error al eliminar la marca en la base de datos.", dbEx);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // Preservar la excepción original como InnerException
                _contextoBasedeDatos.ChangeTracker.Clear();
                throw new Exception("Ocurrió un error al eliminar la marca.", ex);
            }
        }
    }
}
