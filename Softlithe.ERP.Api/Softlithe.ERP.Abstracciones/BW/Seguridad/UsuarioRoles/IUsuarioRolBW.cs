using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;

namespace Softlithe.ERP.Abstracciones.BW.Seguridad.UsuarioRoles
{
    public interface IObtenerUsuarioRolesBW
    {
        Task<UsuarioRolConModeloDeValidacion> ObtenerRolesPorUsuario(int IdUsuario);
    }

    public interface IAsignarRolAUsuarioBW
    {
        Task<ModeloValidacion> AsignarRol(AsignarRolAUsuarioDto Dto);
    }

    public interface IModificarEstadoUsuarioRolBW
    {
        Task<ModeloValidacion> ModificarEstadoUsuarioRol(ModificarEstadoUsuarioRolDto Dto);
    }

    public interface IObtenerPermisosEfectivosUsuarioBW
    {
        Task<PermisosEfectivosConModeloDeValidacion> ObtenerPermisosEfectivos(int IdUsuario);
    }
}

