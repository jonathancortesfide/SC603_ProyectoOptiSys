using Softlithe.ERP.Abstracciones.BW.Seguridad.RolPermisos;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;
using Softlithe.ERP.Abstracciones.DA.Seguridad.RolPermisos;

namespace Softlithe.ERP.BW.Seguridad.RolPermisos
{
    public class ObtenerRolPermisosBW : IObtenerRolPermisosBW
    {
        private readonly IObtenerRolPermisosDA _da;
        public ObtenerRolPermisosBW(IObtenerRolPermisosDA da) => _da = da;

        public async Task<RolPermisoConModeloDeValidacion> ObtenerPermisosPorRol(int IdRol)
        {
            try
            {
                var lista = await _da.ObtenerPermisosPorRol(IdRol);
                return new RolPermisoConModeloDeValidacion { EsCorrecto = true, Mensaje = "OK", Permisos = lista };
            }
            catch (Exception ex)
            {
                return new RolPermisoConModeloDeValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }

    public class AsignarPermisoARolBW : IAsignarPermisoARolBW
    {
        private readonly IAsignarPermisoARolDA _da;
        public AsignarPermisoARolBW(IAsignarPermisoARolDA da) => _da = da;

        public async Task<ModeloValidacion> AsignarPermiso(AsignarPermisoARolDto Dto)
        {
            try
            {
                return await _da.AsignarPermiso(Dto);
            }
            catch (Exception ex)
            {
                return new ModeloValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }

    public class ModificarEstadoRolPermisoBW : IModificarEstadoRolPermisoBW
    {
        private readonly IModificarEstadoRolPermisoDA _da;
        public ModificarEstadoRolPermisoBW(IModificarEstadoRolPermisoDA da) => _da = da;

        public async Task<ModeloValidacion> ModificarEstadoRolPermiso(ModificarEstadoRolPermisoDto Dto)
        {
            try
            {
                return await _da.ModificarEstadoRolPermiso(Dto);
            }
            catch (Exception ex)
            {
                return new ModeloValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }
}
