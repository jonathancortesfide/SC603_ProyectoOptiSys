using Softlithe.ERP.Abstracciones.BW.Seguridad.Roles;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;
using Softlithe.ERP.Abstracciones.DA.Seguridad.Roles;

namespace Softlithe.ERP.BW.Seguridad.Roles
{
    public class ObtenerRolesBW : IObtenerRolesBW
    {
        private readonly IObtenerRolesDA _da;
        public ObtenerRolesBW(IObtenerRolesDA da) => _da = da;

        public async Task<RolConModeloDeValidacion> ObtenerRoles()
        {
            try
            {
                var lista = await _da.ObtenerRoles();
                return new RolConModeloDeValidacion { EsCorrecto = true, Mensaje = "OK", Roles = lista };
            }
            catch (Exception ex)
            {
                return new RolConModeloDeValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }

    public class AgregarRolBW : IAgregarRolBW
    {
        private readonly IAgregarRolDA _da;
        public AgregarRolBW(IAgregarRolDA da) => _da = da;

        public async Task<ModeloValidacion> AgregarRol(AgregarRolDto Dto)
        {
            try
            {
                return await _da.AgregarRol(Dto);
            }
            catch (Exception ex)
            {
                return new ModeloValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }

    public class ModificarEstadoRolBW : IModificarEstadoRolBW
    {
        private readonly IModificarEstadoRolDA _da;
        public ModificarEstadoRolBW(IModificarEstadoRolDA da) => _da = da;

        public async Task<ModeloValidacion> ModificarEstadoRol(ModificarEstadoRolDto Dto)
        {
            try
            {
                return await _da.ModificarEstadoRol(Dto);
            }
            catch (Exception ex)
            {
                return new ModeloValidacion { EsCorrecto = false, Mensaje = ex.Message };
            }
        }
    }
}
