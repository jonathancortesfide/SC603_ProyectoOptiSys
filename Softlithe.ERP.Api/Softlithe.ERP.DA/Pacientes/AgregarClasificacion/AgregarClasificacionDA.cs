using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.DA.Pacientes.AgregarClasificacion;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.DA.GestionBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Pacientes.AgregarClasificacion
{
    public class AgregarClasificacionDA : IAgregarClasificacionDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;
        private readonly IAgregarEventoBitacoraDA _agregarEventoBitacoraDA;

        public AgregarClasificacionDA(ContextoBasedeDatos contextoBasedeDatos, IAgregarEventoBitacoraDA agregarEventoBitacoraDA)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
            _agregarEventoBitacoraDA = agregarEventoBitacoraDA;
        }

        public async Task<ModeloValidacion> Agregar(PacienteClasificacionCrearDto dto)
        {
            ModeloValidacion resultado = new ModeloValidacion() { Mensaje = string.Empty };

            await using IDbContextTransaction transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();
            try
            {
                var entidad = new PacienteClasificacion
                {
                    descripcion = dto.descripcion,
                    no_empresa = dto.no_empresa,
                    activo = dto.activo
                };

                await _contextoBasedeDatos.PacienteClasificaciones.AddAsync(entidad);
                await _contextoBasedeDatos.SaveChangesAsync();
                await transaction.CommitAsync();

                resultado.EsCorrecto = true;
                resultado.Mensaje = MensajesDePacienteClasificacionDto.ClasificacionAgregadaCorrectamente;

                // Registrar en bitacora (no debe romper la operación principal si falla la bitacora)
                try
                {
                    string descripcionEvento = $"{MensajesDePacienteClasificacionDto.ClasificacionAgregadaCorrectamente} no_clasificacion: {entidad.no_clasificacion}, Descripción: {entidad.descripcion}, Activo: {entidad.activo}";

                    BitacoraDto bit = new BitacoraDto
                    {
                        idBitacora = Guid.NewGuid(),
                        identificador = dto.no_empresa,
                        usuario = dto.usuario,
                        descripcionDelEvento = descripcionEvento,
                        fechaDeRegistro = DateTime.Now,
                        nombreDelMetodo = nameof(AgregarClasificacion),
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
                resultado.Mensaje = "Ocurrió un error al agregar la clasificación: " + ex.Message;
                return resultado;
            }
        }
    }
}
