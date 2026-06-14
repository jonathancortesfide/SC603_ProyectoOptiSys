using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;

namespace Softlithe.ERP.Abstracciones.BW.Seguridad.Permisos
{
    public interface IObtenerPermisosBW
    {
        Task<PermisoConModeloDeValidacion> ObtenerPermisos();
    }

    public interface IAgregarPermisoBW
    {
        Task<ModeloValidacion> AgregarPermiso(AgregarPermisoDto Dto);
    }

    public interface IModificarEstadoPermisoBW
    {
        Task<ModeloValidacion> ModificarEstadoPermiso(ModificarEstadoPermisoDto Dto);
    }
}
