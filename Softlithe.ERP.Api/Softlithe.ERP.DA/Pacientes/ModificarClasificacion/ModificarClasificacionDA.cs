using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.DA.Pacientes.ModificarClasificacion;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.DA.GestionBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Pacientes.ModificarClasificacion
{
    public class ModificarClasificacionDA : IModificarClasificacionDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;
        private readonly IAgregarEventoBitacoraDA _agregarEventoBitacoraDA;

        public ModificarClasificacionDA(ContextoBasedeDatos contextoBasedeDatos, IAgregarEventoBitacoraDA agregarEventoBitacoraDA)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
            _agregarEventoBitacoraDA = agregarEventoBitacoraDA;
        }

        public async Task<ModeloValidacion> Modificar(PacienteClasificacionDto dto)
        {
            ModeloValidacion resultado = new ModeloValidacion() { Mensaje = string.Empty };

            await using IDbContextTransaction transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();
            try
            {
                var entidad = _contextoBasedeDatos.PacienteClasificaciones.FirstOrDefault(x => x.no_clasificacion == dto.no_clasificacion);
                if (entidad == null)
                {
                    resultado.EsCorrecto = false;
                    resultado.Mensaje = "Clasificación no encontrada.";
                    return resultado;
                }

                entidad.descripcion = dto.descripcion;
                entidad.activo = dto.activo;

                _contextoBasedeDatos.PacienteClasificaciones.Update(entidad);
                await _contextoBasedeDatos.SaveChangesAsync();
                await transaction.CommitAsync();

                resultado.EsCorrecto = true;
                resultado.Mensaje = MensajesDePacienteClasificacionDto.ClasificacionModificadaCorrectamente;

                try
                {
                    string descripcionEvento = $"{MensajesDePacienteClasificacionDto.ClasificacionModificadaCorrectamente} no_clasificacion: {entidad.no_clasificacion}, Descripción: {entidad.descripcion}, Activo: {entidad.activo}";

                    BitacoraDto bit = new BitacoraDto
                    {
                        idBitacora = Guid.NewGuid(),
                        identificador = entidad.no_empresa,
                        usuario = dto.usuario,
                        descripcionDelEvento = descripcionEvento,
                        fechaDeRegistro = DateTime.Now,
                        nombreDelMetodo = nameof(ModificarClasificacion),
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
                resultado.Mensaje = "Ocurrió un error al modificar la clasificación: " + ex.Message;
                return resultado;
            }
        }
    }
}
