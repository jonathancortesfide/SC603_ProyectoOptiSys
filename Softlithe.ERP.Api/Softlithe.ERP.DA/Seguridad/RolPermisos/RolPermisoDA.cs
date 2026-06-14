using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;
using Softlithe.ERP.Abstracciones.DA.Seguridad.RolPermisos;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Seguridad.RolPermisos
{
    public class ObtenerRolPermisosDA : IObtenerRolPermisosDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public ObtenerRolPermisosDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<List<RolPermisoDto>> ObtenerPermisosPorRol(int IdRol)
        {
            try
            {
                return await _contexto.RolPermisos
                    .Include(rp => rp.Rol)
                    .Include(rp => rp.Permiso)
                    .Where(rp => rp.IdRol == IdRol)
                    .Select(rp => new RolPermisoDto
                    {
                        IdRolPermiso = rp.IdRolPermiso,
                        IdRol = rp.IdRol,
                        NombreRol = rp.Rol != null ? rp.Rol.Nombre : string.Empty,
                        IdPermiso = rp.IdPermiso,
                        NombrePermiso = rp.Permiso != null ? rp.Permiso.Nombre : string.Empty,
                        CodigoPermiso = rp.Permiso != null ? rp.Permiso.Codigo : string.Empty,
                        Activo = rp.Activo
                    })
                    .OrderBy(rp => rp.NombrePermiso)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los permisos del rol.", ex);
            }
        }
    }

    public class AsignarPermisoARolDA : IAsignarPermisoARolDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public AsignarPermisoARolDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<ModeloValidacion> AsignarPermiso(AsignarPermisoARolDto Dto)
        {
            try
            {
                var rolExiste = await _contexto.Roles.AnyAsync(r => r.IdRol == Dto.IdRol);
                if (!rolExiste)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "El rol especificado no existe." };

                var permisoExiste = await _contexto.Permisos.AnyAsync(p => p.IdPermiso == Dto.IdPermiso);
                if (!permisoExiste)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "El permiso especificado no existe." };

                var yaAsignado = await _contexto.RolPermisos
                    .AnyAsync(rp => rp.IdRol == Dto.IdRol && rp.IdPermiso == Dto.IdPermiso);
                if (yaAsignado)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "El permiso ya está asignado a este rol." };

                _contexto.RolPermisos.Add(new RolPermiso { IdRol = Dto.IdRol, IdPermiso = Dto.IdPermiso, Activo = true });
                await _contexto.SaveChangesAsync();
                return new ModeloValidacion { EsCorrecto = true, Mensaje = "Permiso asignado al rol correctamente." };
            }
            catch (Exception ex)
            {
                throw new Exception("Error al asignar el permiso al rol.", ex);
            }
        }
    }

    public class ModificarEstadoRolPermisoDA : IModificarEstadoRolPermisoDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public ModificarEstadoRolPermisoDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<ModeloValidacion> ModificarEstadoRolPermiso(ModificarEstadoRolPermisoDto Dto)
        {
            try
            {
                var rolPermiso = await _contexto.RolPermisos.FindAsync(Dto.IdRolPermiso);
                if (rolPermiso == null)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "Asignación rol-permiso no encontrada." };

                rolPermiso.Activo = Dto.EsActivo;
                await _contexto.SaveChangesAsync();
                return new ModeloValidacion { EsCorrecto = true, Mensaje = "Estado actualizado correctamente." };
            }
            catch (Exception ex)
            {
                throw new Exception("Error al modificar el estado del rol-permiso.", ex);
            }
        }
    }
}
