using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;

namespace Softlithe.ERP.Abstracciones.DA.Seguridad.Roles
{
    public interface IObtenerRolesDA
    {
        Task<List<RolDto>> ObtenerRoles();
    }

    public interface IAgregarRolDA
    {
        Task<ModeloValidacion> AgregarRol(AgregarRolDto Dto);
    }

    public interface IModificarEstadoRolDA
    {
        Task<ModeloValidacion> ModificarEstadoRol(ModificarEstadoRolDto Dto);
    }
}
