using Microsoft.EntityFrameworkCore.Storage;
using Softlithe.ERP.Abstracciones.Contenedores.Grupos;
using Softlithe.ERP.Abstracciones.DA.Grupos.ModificarGrupo;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Linq;
using System.Threading.Tasks;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.DA.GestionBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.DA.Grupos.ModificarGrupo
{
    public class ModificarGrupoDA : IModificarGrupoDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;
        private readonly IAgregarEventoBitacoraDA _agregarEventoBitacoraDA;

        public ModificarGrupoDA(ContextoBasedeDatos contextoBasedeDatos, IAgregarEventoBitacoraDA agregarEventoBitacoraDA)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
            _agregarEventoBitacoraDA = agregarEventoBitacoraDA;
        }

        public async Task<ModeloValidacion> Modificar(GrupoModificarDto dto)
        {
            ModeloValidacion resultado = new ModeloValidacion() { Mensaje = string.Empty };

            await using var transaction = await _contextoBasedeDatos.Database.BeginTransactionAsync();
            try
            {
                // Buscar por no_grupo únicamente (no es necesario enviar no_empresa en el body)
                var entidad = _contextoBasedeDatos.Set<Grupo>().FirstOrDefault(x => x.no_grupo == dto.no_grupo);
                if (entidad == null)
                {
                    resultado.EsCorrecto = false;
                    resultado.Mensaje = "Grupo no encontrado.";
                    return resultado;
                }

                entidad.Descripcion = dto.Descripcion;
                entidad.activo = dto.activo;

                _contextoBasedeDatos.Set<Grupo>().Update(entidad);
                await _contextoBasedeDatos.SaveChangesAsync();
                await transaction.CommitAsync();

                resultado.EsCorrecto = true;
                resultado.Mensaje = MensajesDeGrupoDto.GrupoModificadoCorrectamente;

                try
                {
                    string descripcionEvento = $"{MensajesDeGrupoDto.GrupoModificadoCorrectamente} no_grupo: {entidad.no_grupo}, no_empresa: {entidad.no_empresa}, Descripción: {entidad.Descripcion}, Activo: {entidad.activo}";

                    BitacoraDto bit = new BitacoraDto
                    {
                        idBitacora = Guid.NewGuid(),
                        identificador = dto.identificador,
                        usuario = dto.usuario,
                        descripcionDelEvento = descripcionEvento,
                        fechaDeRegistro = DateTime.Now,
                        nombreDelMetodo = nameof(ModificarGrupo),
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
                resultado.Mensaje = "Ocurrió un error al modificar el grupo: " + ex.Message;
                return resultado;
            }
        }
    }
}
