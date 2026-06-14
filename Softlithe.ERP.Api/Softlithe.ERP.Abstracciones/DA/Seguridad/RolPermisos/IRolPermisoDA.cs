using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;

namespace Softlithe.ERP.Abstracciones.DA.Seguridad.RolPermisos
{
    public interface IObtenerRolPermisosDA
    {
        Task<List<RolPermisoDto>> ObtenerPermisosPorRol(int IdRol);
    }

    public interface IAsignarPermisoARolDA
    {
        Task<ModeloValidacion> AsignarPermiso(AsignarPermisoARolDto Dto);
    }

    public interface IModificarEstadoRolPermisoDA
    {
        Task<ModeloValidacion> ModificarEstadoRolPermiso(ModificarEstadoRolPermisoDto Dto);
    }
}
