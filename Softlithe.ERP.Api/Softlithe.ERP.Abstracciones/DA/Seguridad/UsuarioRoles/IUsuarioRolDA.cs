using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;

namespace Softlithe.ERP.Abstracciones.DA.Seguridad.UsuarioRoles
{
    public interface IObtenerUsuarioRolesDA
    {
        Task<List<UsuarioRolDto>> ObtenerRolesPorUsuario(int IdUsuario);
    }

    public interface IAsignarRolAUsuarioDA
    {
        Task<ModeloValidacion> AsignarRol(AsignarRolAUsuarioDto Dto);
    }

    public interface IModificarEstadoUsuarioRolDA
    {
        Task<ModeloValidacion> ModificarEstadoUsuarioRol(ModificarEstadoUsuarioRolDto Dto);
    }

    public interface IObtenerPermisosEfectivosUsuarioDA
    {
        Task<List<PermisoEfectivoDto>> ObtenerPermisosEfectivos(int IdUsuario);
    }
}

