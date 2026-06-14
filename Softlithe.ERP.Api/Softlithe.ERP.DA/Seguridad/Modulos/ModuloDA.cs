using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;
using Softlithe.ERP.Abstracciones.DA.Seguridad.Modulos;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Seguridad.Modulos
{
    public class ObtenerModulosDA : IObtenerModulosDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public ObtenerModulosDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<List<ModuloDto>> ObtenerModulos()
        {
            try
            {
                return await _contexto.Modulos
                    .Include(m => m.Seccion)
                    .Select(m => new ModuloDto
                    {
                        IdModulo = m.IdModulo,
                        Nombre = m.Nombre,
                        Descripcion = m.Descripcion,
                        IdSeccion = m.IdSeccion,
                        NombreSeccion = m.Seccion != null ? m.Seccion.Nombre : string.Empty,
                        Activo = m.Activo
                    })
                    .OrderBy(m => m.NombreSeccion).ThenBy(m => m.Nombre)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los módulos.", ex);
            }
        }
    }

    public class AgregarModuloDA : IAgregarModuloDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public AgregarModuloDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<ModeloValidacion> AgregarModulo(AgregarModuloDto Dto)
        {
            try
            {
                var seccionExiste = await _contexto.Secciones.AnyAsync(s => s.IdSeccion == Dto.IdSeccion);
                if (!seccionExiste)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "La sección especificada no existe." };

                var existe = await _contexto.Modulos
                    .AnyAsync(m => m.Nombre.ToLower() == Dto.Nombre.ToLower() && m.IdSeccion == Dto.IdSeccion);
                if (existe)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "Ya existe un módulo con ese nombre en la sección indicada." };

                _contexto.Modulos.Add(new Modulo
                {
                    Nombre = Dto.Nombre,
                    Descripcion = Dto.Descripcion,
                    IdSeccion = Dto.IdSeccion,
                    Activo = true
                });
                await _contexto.SaveChangesAsync();
                return new ModeloValidacion { EsCorrecto = true, Mensaje = "Módulo agregado correctamente." };
            }
            catch (Exception ex)
            {
                throw new Exception("Error al agregar el módulo.", ex);
            }
        }
    }

    public class ModificarEstadoModuloDA : IModificarEstadoModuloDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public ModificarEstadoModuloDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<ModeloValidacion> ModificarEstadoModulo(ModificarEstadoModuloDto Dto)
        {
            try
            {
                var modulo = await _contexto.Modulos.FindAsync(Dto.IdModulo);
                if (modulo == null)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "Módulo no encontrado." };

                modulo.Activo = Dto.EsActivo;
                await _contexto.SaveChangesAsync();
                return new ModeloValidacion { EsCorrecto = true, Mensaje = "Estado del módulo actualizado correctamente." };
            }
            catch (Exception ex)
            {
                throw new Exception("Error al modificar el estado del módulo.", ex);
            }
        }
    }
}
