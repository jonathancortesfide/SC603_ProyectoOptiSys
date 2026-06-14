using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;

namespace Softlithe.ERP.Abstracciones.DA.Seguridad.Permisos
{
    public interface IObtenerPermisosDA
    {
        Task<List<PermisoDto>> ObtenerPermisos();
    }

    public interface IAgregarPermisoDA
    {
        Task<ModeloValidacion> AgregarPermiso(AgregarPermisoDto Dto);
    }

    public interface IModificarEstadoPermisoDA
    {
        Task<ModeloValidacion> ModificarEstadoPermiso(ModificarEstadoPermisoDto Dto);
    }
}
