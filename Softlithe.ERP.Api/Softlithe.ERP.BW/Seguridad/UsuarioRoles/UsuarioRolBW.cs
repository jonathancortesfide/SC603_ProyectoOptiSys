using Softlithe.ERP.Abstracciones.BW.Seguridad.UsuarioRoles;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;
using Softlithe.ERP.Abstracciones.DA.Seguridad.UsuarioRoles;
namespace Softlithe.ERP.BW.Seguridad.UsuarioRoles
{
    public class ObtenerUsuarioRolesBW : IObtenerUsuarioRolesBW
    {
        private readonly IObtenerUsuarioRolesDA _da;
        public ObtenerUsuarioRolesBW(IObtenerUsuarioRolesDA da) => _da = da;

        public async Task<UsuarioRolConModeloDeValidacion> ObtenerRolesPorUsuario(int IdUsuario)
        {
            try
            {
                var lista = await _da.ObtenerRolesPorUsuario(IdUsuario);
                return new UsuarioRolConModeloDeValidacion { EsCorrecto = true, Mensaje = "OK", Roles = lista };
            }
            catch (Exception ex)
            {
                return new UsuarioRolConModeloDeValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }

    public class AsignarRolAUsuarioBW : IAsignarRolAUsuarioBW
    {
        private readonly IAsignarRolAUsuarioDA _da;
        public AsignarRolAUsuarioBW(IAsignarRolAUsuarioDA da) => _da = da;

        public async Task<ModeloValidacion> AsignarRol(AsignarRolAUsuarioDto Dto)
        {
            try
            {
                return await _da.AsignarRol(Dto);
            }
            catch (Exception ex)
            {
                return new ModeloValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }

    public class ModificarEstadoUsuarioRolBW : IModificarEstadoUsuarioRolBW
    {
        private readonly IModificarEstadoUsuarioRolDA _da;
        public ModificarEstadoUsuarioRolBW(IModificarEstadoUsuarioRolDA da) => _da = da;

        public async Task<ModeloValidacion> ModificarEstadoUsuarioRol(ModificarEstadoUsuarioRolDto Dto)
        {
            try
            {
                return await _da.ModificarEstadoUsuarioRol(Dto);
            }
            catch (Exception ex)
            {
                return new ModeloValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }

    public class ObtenerPermisosEfectivosUsuarioBW : IObtenerPermisosEfectivosUsuarioBW
    {
        private readonly IObtenerPermisosEfectivosUsuarioDA _da;
        public ObtenerPermisosEfectivosUsuarioBW(IObtenerPermisosEfectivosUsuarioDA da) => _da = da;

        public async Task<PermisosEfectivosConModeloDeValidacion> ObtenerPermisosEfectivos(int IdUsuario)
        {
            try
            {
                var lista = await _da.ObtenerPermisosEfectivos(IdUsuario);
                return new PermisosEfectivosConModeloDeValidacion { EsCorrecto = true, Mensaje = "OK", Permisos = lista };
            }
            catch (Exception ex)
            {
                return new PermisosEfectivosConModeloDeValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }
}
