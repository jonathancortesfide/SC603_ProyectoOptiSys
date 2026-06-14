using Softlithe.ERP.Abstracciones.BW.Seguridad.Permisos;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;
using Softlithe.ERP.Abstracciones.DA.Seguridad.Permisos;

namespace Softlithe.ERP.BW.Seguridad.Permisos
{
    public class ObtenerPermisosBW : IObtenerPermisosBW
    {
        private readonly IObtenerPermisosDA _da;
        public ObtenerPermisosBW(IObtenerPermisosDA da) => _da = da;

        public async Task<PermisoConModeloDeValidacion> ObtenerPermisos()
        {
            try
            {
                var lista = await _da.ObtenerPermisos();
                return new PermisoConModeloDeValidacion { EsCorrecto = true, Mensaje = "OK", Permisos = lista };
            }
            catch (Exception ex)
            {
                return new PermisoConModeloDeValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }

    public class AgregarPermisoBW : IAgregarPermisoBW
    {
        private readonly IAgregarPermisoDA _da;
        public AgregarPermisoBW(IAgregarPermisoDA da) => _da = da;

        public async Task<ModeloValidacion> AgregarPermiso(AgregarPermisoDto Dto)
        {
            try
            {
                return await _da.AgregarPermiso(Dto);
            }
            catch (Exception ex)
            {
                return new ModeloValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }

    public class ModificarEstadoPermisoBW : IModificarEstadoPermisoBW
    {
        private readonly IModificarEstadoPermisoDA _da;
        public ModificarEstadoPermisoBW(IModificarEstadoPermisoDA da) => _da = da;

        public async Task<ModeloValidacion> ModificarEstadoPermiso(ModificarEstadoPermisoDto Dto)
        {
            try
            {
                return await _da.ModificarEstadoPermiso(Dto);
            }
            catch (Exception ex)
            {
                return new ModeloValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }
}
