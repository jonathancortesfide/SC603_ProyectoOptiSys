using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.DA.Pacientes.CambiarEstadoClasificacion;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.DA.GestionBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Pacientes.CambiarEstadoClasificacion
{
    public class CambiarEstadoClasificacionDA : ICambiarEstadoClasificacionDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;
        private readonly IAgregarEventoBitacoraDA _agregarEventoBitacoraDA;

        public CambiarEstadoClasificacionDA(ContextoBasedeDatos contextoBasedeDatos, IAgregarEventoBitacoraDA agregarEventoBitacoraDA)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
            _agregarEventoBitacoraDA = agregarEventoBitacoraDA;
        }

        public async Task<ModeloValidacion> CambiarEstado(int no_clasificacion, int identificador, string usuario, bool activo)
        {
            ModeloValidacion resultado = new ModeloValidacion() { Mensaje = string.Empty };
            await using IDbContextTransaction transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();
            try
            {
                var entidad = _contextoBasedeDatos.PacienteClasificaciones.FirstOrDefault(x => x.no_clasificacion == no_clasificacion && x.identificador == identificador);
                if (entidad == null)
                {
                    resultado.EsCorrecto = false;
                    resultado.Mensaje = "Clasificación no encontrada.";
                    return resultado;
                }

                entidad.activo = activo;
                _contextoBasedeDatos.PacienteClasificaciones.Update(entidad);
                await _contextoBasedeDatos.SaveChangesAsync();
                await transaction.CommitAsync();

                resultado.EsCorrecto = true;
                resultado.Mensaje = MensajesDePacienteClasificacionDto.ClasificacionEstadoCambiadoCorrectamente;

                try
                {
                    string descripcionEvento = $"{MensajesDePacienteClasificacionDto.ClasificacionEstadoCambiadoCorrectamente} no_clasificacion: {no_clasificacion}, Descripción: {entidad.descripcion}, Activo: {activo}";

                    BitacoraDto bit = new BitacoraDto
                    {
                        idBitacora = Guid.NewGuid(),
                        identificador = identificador,
                        usuario = usuario,
                        descripcionDelEvento = descripcionEvento,
                        fechaDeRegistro = DateTime.Now,
                        nombreDelMetodo = nameof(CambiarEstado),
                        tabla = "PacienteClasificacion",
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
