using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.DA.Grupos.CambiarEstadoGrupo;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Linq;
using System.Threading.Tasks;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.DA.GestionBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.DA.Grupos.CambiarEstadoGrupo
{
    public class CambiarEstadoGrupoDA : ICambiarEstadoGrupoDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;
        private readonly IAgregarEventoBitacoraDA _agregarEventoBitacoraDA;

        public CambiarEstadoGrupoDA(ContextoBasedeDatos contextoBasedeDatos, IAgregarEventoBitacoraDA agregarEventoBitacoraDA)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
            _agregarEventoBitacoraDA = agregarEventoBitacoraDA;
        }

        public async Task<ModeloValidacion> CambiarEstado(int no_grupo, string usuario, bool activo)
        {
            ModeloValidacion resultado = new ModeloValidacion() { Mensaje = string.Empty };
            await using var transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();
            try
            {
                var entidad = _contextoBasedeDatos.Set<Grupo>().FirstOrDefault(x => x.no_grupo == no_grupo);
                if (entidad == null)
                {
                    resultado.EsCorrecto = false;
                    resultado.Mensaje = "Grupo no encontrado.";
                    return resultado;
                }

                int identificador = entidad.no_empresa; // obtener identificador desde la tabla Grupo

                entidad.activo = activo;
                _contextoBasedeDatos.Set<Grupo>().Update(entidad);
                await _contextoBasedeDatos.SaveChangesAsync();
                await transaction.CommitAsync();

                resultado.EsCorrecto = true;
                resultado.Mensaje = MensajesDeGrupoDto.GrupoEstadoCambiadoCorrectamente;

                try
                {
                    string descripcionEvento = $"{MensajesDeGrupoDto.GrupoEstadoCambiadoCorrectamente} no_grupo: {entidad.no_grupo}, Descripción: {entidad.Descripcion}, Activo: {entidad.activo}";

                    BitacoraDto bit = new BitacoraDto
                    {
                        idBitacora = Guid.NewGuid(),
                        identificador = identificador,
                        usuario = usuario,
                        descripcionDelEvento = descripcionEvento,
                        fechaDeRegistro = DateTime.Now,
                        nombreDelMetodo = nameof(CambiarEstado),
                        tabla = "Grupo",
                        mensajeExcepcion = string.Empty,
                        stackTrace = string.Empty
                    };
                    await _agregarEventoBitacoraDA.Agregar(bit);
                }
                catch { }

                return resultado;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                _contextoBasedeDatos.ChangeTracker.Clear();
                resultado.EsCorrecto = false;
                resultado.Mensaje = "Ocurrió un error al cambiar el estado: " + ex.Message;
                return resultado;
            }
        }
    }
}
