using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.TipoLente;
using Softlithe.ERP.Abstracciones.DA.TipoLente.ModificarTipoLente;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.TipoLente.ModificarTipoLente
{
    public class ModificarTipoLenteAD : IModificarTipoLenteAD
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;

        public ModificarTipoLenteAD(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }

        public async Task<int> ModificarTipoLente(TipoLenteDto elTipoLente)
        {

            if (elTipoLente == null) throw new ArgumentNullException(nameof(elTipoLente));
            await using IDbContextTransaction transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();

            try
            {

                TipoLenteAD? TipoLenteExistente = await _contextoBasedeDatos.TipoLente.FindAsync(elTipoLente.no_tipo);
                if (TipoLenteExistente == null)
                {
                    return 0; // No se encontró el tipo de lente a modificar
                }
                // Actualizar las propiedades del tipo de lente existente con los valores del DTO
                TipoLenteExistente.Descripcion = elTipoLente.descripcion;
                TipoLenteExistente.Activo = elTipoLente.Activo; // Actualizar el estado si es necesario
                _contextoBasedeDatos.TipoLente.Update(TipoLenteExistente);
                int resultadoRegistro = await _contextoBasedeDatos.SaveChangesAsync();
                return resultadoRegistro; // Retorna el número de registros afectados
            }
            catch (DbUpdateException dbEx)
            {
                await transaction.RollbackAsync();
                _contextoBasedeDatos.ChangeTracker.Clear();
                throw new Exception("Ocurrió un error al modificar el tipo de lente en la base de datos.", dbEx);
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _contextoBasedeDatos.ChangeTracker.Clear();
                throw new Exception("Ocurrió un error al modificar el tipo de lente.", ex);
            }
        }
    }
}