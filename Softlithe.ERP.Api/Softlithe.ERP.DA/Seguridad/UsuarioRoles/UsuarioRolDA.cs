using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;
using Softlithe.ERP.Abstracciones.DA.Seguridad.UsuarioRoles;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Seguridad.UsuarioRoles
{
    public class ObtenerUsuarioRolesDA : IObtenerUsuarioRolesDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public ObtenerUsuarioRolesDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<List<UsuarioRolDto>> ObtenerRolesPorUsuario(int IdUsuario)
        {
            try
            {
                return await _contexto.UsuarioRoles
                    .Include(ur => ur.Usuario)
                    .Include(ur => ur.Rol)
                    .Where(ur => ur.IdUsuario == IdUsuario)
                    .Select(ur => new UsuarioRolDto
                    {
                        IdUsuarioRol = ur.IdUsuarioRol,
                        IdUsuario = ur.IdUsuario,
                        NombreUsuario = ur.Usuario != null ? ur.Usuario.Nombre ?? string.Empty : string.Empty,
                        IdRol = ur.IdRol,
                        NombreRol = ur.Rol != null ? ur.Rol.Nombre : string.Empty,
                        Activo = ur.Activo
                    })
                    .OrderBy(ur => ur.NombreRol)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los roles del usuario.", ex);
            }
        }
    }

    public class AsignarRolAUsuarioDA : IAsignarRolAUsuarioDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public AsignarRolAUsuarioDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<ModeloValidacion> AsignarRol(AsignarRolAUsuarioDto Dto)
        {
            try
            {
                var usuarioExiste = await _contexto.Usuarios.AnyAsync(u => u.IdUsuario == Dto.IdUsuario);
                if (!usuarioExiste)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "El usuario especificado no existe." };

                var rolExiste = await _contexto.Roles.AnyAsync(r => r.IdRol == Dto.IdRol);
                if (!rolExiste)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "El rol especificado no existe." };

                var yaAsignado = await _contexto.UsuarioRoles
                    .AnyAsync(ur => ur.IdUsuario == Dto.IdUsuario && ur.IdRol == Dto.IdRol);
                if (yaAsignado)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "El rol ya está asignado a este usuario." };

                _contexto.UsuarioRoles.Add(new UsuarioRol { IdUsuario = Dto.IdUsuario, IdRol = Dto.IdRol, Activo = true });
                await _contexto.SaveChangesAsync();
                return new ModeloValidacion { EsCorrecto = true, Mensaje = "Rol asignado al usuario correctamente." };
            }
            catch (Exception ex)
            {
                throw new Exception("Error al asignar el rol al usuario.", ex);
            }
        }
    }

    public class ModificarEstadoUsuarioRolDA : IModificarEstadoUsuarioRolDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public ModificarEstadoUsuarioRolDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<ModeloValidacion> ModificarEstadoUsuarioRol(ModificarEstadoUsuarioRolDto Dto)
        {
            try
            {
                var usuarioRol = await _contexto.UsuarioRoles.FindAsync(Dto.IdUsuarioRol);
                if (usuarioRol == null)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "Asignación usuario-rol no encontrada." };

                usuarioRol.Activo = Dto.EsActivo;
                await _contexto.SaveChangesAsync();
                return new ModeloValidacion { EsCorrecto = true, Mensaje = "Estado actualizado correctamente." };
            }
            catch (Exception ex)
            {
                throw new Exception("Error al modificar el estado del usuario-rol.", ex);
            }
        }
    }

    public class ObtenerPermisosEfectivosUsuarioDA : IObtenerPermisosEfectivosUsuarioDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public ObtenerPermisosEfectivosUsuarioDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<List<PermisoEfectivoDto>> ObtenerPermisosEfectivos(int IdUsuario)
        {
            try
            {
                return await _contexto.UsuarioRoles
                    .AsNoTracking()
                    .Where(ur => ur.IdUsuario == IdUsuario && ur.Activo)
                    .Join(_contexto.RolPermisos.Where(rp => rp.Activo),
                        ur => ur.IdRol,
                        rp => rp.IdRol,
                        (ur, rp) => new { ur.Rol, rp.Permiso })
                    .Where(x => x.Permiso != null && x.Permiso.Activo
                             && x.Rol != null && x.Rol.Activo)
                    .Select(x => new PermisoEfectivoDto
                    {
                        IdPermiso       = x.Permiso!.IdPermiso,
                        NombrePermiso   = x.Permiso.Nombre,
                        CodigoPermiso   = x.Permiso.Codigo,
                        DescripcionPermiso = x.Permiso.Descripcion,
                        IdModulo        = x.Permiso.IdModulo,
                        NombreModulo    = x.Permiso.Modulo != null ? x.Permiso.Modulo.Nombre : string.Empty,
                        IdSeccion       = x.Permiso.Modulo != null ? x.Permiso.Modulo.IdSeccion : 0,
                        NombreSeccion   = x.Permiso.Modulo != null && x.Permiso.Modulo.Seccion != null
                                            ? x.Permiso.Modulo.Seccion.Nombre : string.Empty,
                        IdRol           = x.Rol!.IdRol,
                        NombreRol       = x.Rol.Nombre,
                    })
                    .Distinct()
                    .OrderBy(p => p.NombreSeccion)
                    .ThenBy(p => p.NombreModulo)
                    .ThenBy(p => p.NombrePermiso)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los permisos efectivos del usuario.", ex);
            }
        }
    }
}
