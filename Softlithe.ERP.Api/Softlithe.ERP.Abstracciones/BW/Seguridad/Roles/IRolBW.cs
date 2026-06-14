using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;

namespace Softlithe.ERP.Abstracciones.BW.Seguridad.Roles
{
    public interface IObtenerRolesBW
    {
        Task<RolConModeloDeValidacion> ObtenerRoles();
    }

    public interface IAgregarRolBW
    {
        Task<ModeloValidacion> AgregarRol(AgregarRolDto Dto);
    }

    public interface IModificarEstadoRolBW
    {
        Task<ModeloValidacion> ModificarEstadoRol(ModificarEstadoRolDto Dto);
    }
}
