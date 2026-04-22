using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Grupos;
using Softlithe.ERP.Abstracciones.DA.Grupos.AgregarGrupo;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Threading.Tasks;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.DA.GestionBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.DA.Grupos.AgregarGrupo
{
    public class AgregarGrupoDA : IAgregarGrupoDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;
        private readonly IAgregarEventoBitacoraDA _agregarEventoBitacoraDA;

        public AgregarGrupoDA(ContextoBasedeDatos contextoBasedeDatos, IAgregarEventoBitacoraDA agregarEventoBitacoraDA)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
            _agregarEventoBitacoraDA = agregarEventoBitacoraDA;
        }

        public async Task<ModeloValidacion> Agregar(GrupoCrearDto dto)
        {
            ModeloValidacion resultado = new ModeloValidacion() { Mensaje = string.Empty };

            await using var transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();
            try
            {
                var entidad = new Grupo
                {
                    Descripcion = dto.Descripcion,
                    no_empresa = dto.no_empresa,
                    activo = dto.activo,
                    fecha_creacion = DateTime.Now
                };

                await _contextoBasedeDatos.Set<Grupo>().AddAsync(entidad);
                await _contextoBasedeDatos.SaveChangesAsync();
                await transaction.CommitAsync();

                resultado.EsCorrecto = true;
                resultado.Mensaje = MensajesDeGrupoDto.GrupoAgregadoCorrectamente;

                try
                {
                    string descripcionEvento = $"{MensajesDeGrupoDto.GrupoAgregadoCorrectamente} no_grupo: {entidad.no_grupo}, Descripción: {entidad.Descripcion}, Activo: {entidad.activo}";

                    BitacoraDto bit = new BitacoraDto
                    {
                        idBitacora = Guid.NewGuid(),
                        identificador = dto.identificador,
                        usuario = dto.usuario,
                        descripcionDelEvento = descripcionEvento,
                        fechaDeRegistro = DateTime.Now,
                        nombreDelMetodo = nameof(AgregarGrupo),
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
                resultado.Mensaje = "Ocurrió un error al agregar el grupo: " + ex.Message;
                return resultado;
            }
        }
    }
}
