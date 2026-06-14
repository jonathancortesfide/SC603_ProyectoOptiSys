using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;

namespace Softlithe.ERP.Abstracciones.BW.Seguridad.RolPermisos
{
    public interface IObtenerRolPermisosBW
    {
        Task<RolPermisoConModeloDeValidacion> ObtenerPermisosPorRol(int IdRol);
    }

    public interface IAsignarPermisoARolBW
    {
        Task<ModeloValidacion> AsignarPermiso(AsignarPermisoARolDto Dto);
    }

    public interface IModificarEstadoRolPermisoBW
    {
        Task<ModeloValidacion> ModificarEstadoRolPermiso(ModificarEstadoRolPermisoDto Dto);
    }
}
