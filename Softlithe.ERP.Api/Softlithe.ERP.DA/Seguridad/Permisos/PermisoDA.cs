using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;
using Softlithe.ERP.Abstracciones.DA.Seguridad.Permisos;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Seguridad.Permisos
{
    public class ObtenerPermisosDA : IObtenerPermisosDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public ObtenerPermisosDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<List<PermisoDto>> ObtenerPermisos()
        {
            try
            {
                return await _contexto.Permisos
                    .Include(p => p.Modulo)
                    .Select(p => new PermisoDto
                    {
                        IdPermiso = p.IdPermiso,
                        Nombre = p.Nombre,
                        Codigo = p.Codigo,
                        Descripcion = p.Descripcion,
                        IdModulo = p.IdModulo,
                        NombreModulo = p.Modulo != null ? p.Modulo.Nombre : string.Empty,
                        Activo = p.Activo
                    })
                    .OrderBy(p => p.NombreModulo).ThenBy(p => p.Nombre)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los permisos.", ex);
            }
        }
    }

    public class AgregarPermisoDA : IAgregarPermisoDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public AgregarPermisoDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<ModeloValidacion> AgregarPermiso(AgregarPermisoDto Dto)
        {
            try
            {
                var moduloExiste = await _contexto.Modulos.AnyAsync(m => m.IdModulo == Dto.IdModulo);
                if (!moduloExiste)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "El módulo especificado no existe." };

                var codigoExiste = await _contexto.Permisos.AnyAsync(p => p.Codigo.ToLower() == Dto.Codigo.ToLower());
                if (codigoExiste)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "Ya existe un permiso con ese código." };

                _contexto.Permisos.Add(new Permiso
                {
                    Nombre = Dto.Nombre,
                    Codigo = Dto.Codigo.ToUpper(),
                    Descripcion = Dto.Descripcion,
                    IdModulo = Dto.IdModulo,
                    Activo = true
                });
                await _contexto.SaveChangesAsync();
                return new ModeloValidacion { EsCorrecto = true, Mensaje = "Permiso agregado correctamente." };
            }
            catch (Exception ex)
            {
                throw new Exception("Error al agregar el permiso.", ex);
            }
        }
    }

    public class ModificarEstadoPermisoDA : IModificarEstadoPermisoDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public ModificarEstadoPermisoDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<ModeloValidacion> ModificarEstadoPermiso(ModificarEstadoPermisoDto Dto)
        {
            try
            {
                var permiso = await _contexto.Permisos.FindAsync(Dto.IdPermiso);
                if (permiso == null)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "Permiso no encontrado." };

                permiso.Activo = Dto.EsActivo;
                await _contexto.SaveChangesAsync();
                return new ModeloValidacion { EsCorrecto = true, Mensaje = "Estado del permiso actualizado correctamente." };
            }
            catch (Exception ex)
            {
                throw new Exception("Error al modificar el estado del permiso.", ex);
            }
        }
    }
}
