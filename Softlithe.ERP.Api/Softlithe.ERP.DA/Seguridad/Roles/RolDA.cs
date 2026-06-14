using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;
using Softlithe.ERP.Abstracciones.DA.Seguridad.Roles;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Seguridad.Roles
{
    public class ObtenerRolesDA : IObtenerRolesDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public ObtenerRolesDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<List<RolDto>> ObtenerRoles()
        {
            try
            {
                return await _contexto.Roles
                    .Select(r => new RolDto
                    {
                        IdRol = r.IdRol,
                        Nombre = r.Nombre,
                        Descripcion = r.Descripcion,
                        Activo = r.Activo
                    })
                    .OrderBy(r => r.Nombre)
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los roles.", ex);
            }
        }
    }

    public class AgregarRolDA : IAgregarRolDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public AgregarRolDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<ModeloValidacion> AgregarRol(AgregarRolDto Dto)
        {
            try
            {
                var existe = await _contexto.Roles.AnyAsync(r => r.Nombre.ToLower() == Dto.Nombre.ToLower());
                if (existe)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "Ya existe un rol con ese nombre." };

                _contexto.Roles.Add(new Rol { Nombre = Dto.Nombre, Descripcion = Dto.Descripcion, Activo = true });
                await _contexto.SaveChangesAsync();
                return new ModeloValidacion { EsCorrecto = true, Mensaje = "Rol agregado correctamente." };
            }
            catch (Exception ex)
            {
                throw new Exception("Error al agregar el rol.", ex);
            }
        }
    }

    public class ModificarEstadoRolDA : IModificarEstadoRolDA
    {
        private readonly ContextoBasedeDatos _contexto;

        public ModificarEstadoRolDA(ContextoBasedeDatos contexto) => _contexto = contexto;

        public async Task<ModeloValidacion> ModificarEstadoRol(ModificarEstadoRolDto Dto)
        {
            try
            {
                var rol = await _contexto.Roles.FindAsync(Dto.IdRol);
                if (rol == null)
                    return new ModeloValidacion { EsCorrecto = false, Mensaje = "Rol no encontrado." };

                rol.Activo = Dto.EsActivo;
                await _contexto.SaveChangesAsync();
                return new ModeloValidacion { EsCorrecto = true, Mensaje = "Estado del rol actualizado correctamente." };
            }
            catch (Exception ex)
            {
                throw new Exception("Error al modificar el estado del rol.", ex);
            }
        }
    }
}
