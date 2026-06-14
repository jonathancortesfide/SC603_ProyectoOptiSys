using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Seguridad.Roles;
using Softlithe.ERP.Abstracciones.BW.Seguridad.RolPermisos;
using Softlithe.ERP.Abstracciones.BW.Seguridad.UsuarioRoles;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;

namespace Softlithe.ERP.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController : ControllerBase
    {
        private readonly IObtenerRolesBW _obtenerRolesBW;
        private readonly IAgregarRolBW _agregarRolBW;
        private readonly IModificarEstadoRolBW _modificarEstadoRolBW;
        private readonly IObtenerRolPermisosBW _obtenerRolPermisosBW;
        private readonly IAsignarPermisoARolBW _asignarPermisoARolBW;
        private readonly IModificarEstadoRolPermisoBW _modificarEstadoRolPermisoBW;

        public RolesController(
            IObtenerRolesBW obtenerRolesBW,
            IAgregarRolBW agregarRolBW,
            IModificarEstadoRolBW modificarEstadoRolBW,
            IObtenerRolPermisosBW obtenerRolPermisosBW,
            IAsignarPermisoARolBW asignarPermisoARolBW,
            IModificarEstadoRolPermisoBW modificarEstadoRolPermisoBW)
        {
            _obtenerRolesBW = obtenerRolesBW;
            _agregarRolBW = agregarRolBW;
            _modificarEstadoRolBW = modificarEstadoRolBW;
            _obtenerRolPermisosBW = obtenerRolPermisosBW;
            _asignarPermisoARolBW = asignarPermisoARolBW;
            _modificarEstadoRolPermisoBW = modificarEstadoRolPermisoBW;
        }

        [HttpGet]
        public async Task<RolConModeloDeValidacion> ObtenerRoles()
        {
            return await _obtenerRolesBW.ObtenerRoles();
        }

        [HttpPost]
        public async Task<ModeloValidacion> AgregarRol([FromBody] AgregarRolDto Dto)
        {
            return await _agregarRolBW.AgregarRol(Dto);
        }

        [HttpPost("estado")]
        public async Task<ModeloValidacion> ModificarEstadoRol([FromBody] ModificarEstadoRolDto Dto)
        {
            return await _modificarEstadoRolBW.ModificarEstadoRol(Dto);
        }

        [HttpGet("{idRol}/permisos")]
        public async Task<RolPermisoConModeloDeValidacion> ObtenerPermisosPorRol(int idRol)
        {
            return await _obtenerRolPermisosBW.ObtenerPermisosPorRol(idRol);
        }

        [HttpPost("permisos")]
        public async Task<ModeloValidacion> AsignarPermiso([FromBody] AsignarPermisoARolDto Dto)
        {
            return await _asignarPermisoARolBW.AsignarPermiso(Dto);
        }

        [HttpPost("permisos/estado")]
        public async Task<ModeloValidacion> ModificarEstadoRolPermiso([FromBody] ModificarEstadoRolPermisoDto Dto)
        {
            return await _modificarEstadoRolPermisoBW.ModificarEstadoRolPermiso(Dto);
        }
    }

    [Route("api/usuarios/{idUsuario}/roles")]
    [ApiController]
    public class UsuarioRolesController : ControllerBase
    {
        private readonly IObtenerUsuarioRolesBW _obtenerUsuarioRolesBW;
        private readonly IAsignarRolAUsuarioBW _asignarRolAUsuarioBW;
        private readonly IModificarEstadoUsuarioRolBW _modificarEstadoUsuarioRolBW;
        private readonly IObtenerPermisosEfectivosUsuarioBW _obtenerPermisosEfectivosBW;

        public UsuarioRolesController(
            IObtenerUsuarioRolesBW obtenerUsuarioRolesBW,
            IAsignarRolAUsuarioBW asignarRolAUsuarioBW,
            IModificarEstadoUsuarioRolBW modificarEstadoUsuarioRolBW,
            IObtenerPermisosEfectivosUsuarioBW obtenerPermisosEfectivosBW)
        {
            _obtenerUsuarioRolesBW = obtenerUsuarioRolesBW;
            _asignarRolAUsuarioBW = asignarRolAUsuarioBW;
            _modificarEstadoUsuarioRolBW = modificarEstadoUsuarioRolBW;
            _obtenerPermisosEfectivosBW = obtenerPermisosEfectivosBW;
        }

        [HttpGet]
        public async Task<UsuarioRolConModeloDeValidacion> ObtenerRolesPorUsuario(int idUsuario)
        {
            return await _obtenerUsuarioRolesBW.ObtenerRolesPorUsuario(idUsuario);
        }

        [HttpPost]
        public async Task<ModeloValidacion> AsignarRol(int idUsuario, [FromBody] AsignarRolAUsuarioDto Dto)
        {
            Dto.IdUsuario = idUsuario;
            return await _asignarRolAUsuarioBW.AsignarRol(Dto);
        }

        [HttpPost("estado")]
        public async Task<ModeloValidacion> ModificarEstadoUsuarioRol([FromBody] ModificarEstadoUsuarioRolDto Dto)
        {
            return await _modificarEstadoUsuarioRolBW.ModificarEstadoUsuarioRol(Dto);
        }

        /// <summary>
        /// Devuelve todos los permisos efectivos del usuario a través de sus roles activos.
        /// Usar para poblar el guard de permisos en el front end (verificar por CodigoPermiso).
        /// </summary>
        [HttpGet("permisos")]
        public async Task<PermisosEfectivosConModeloDeValidacion> ObtenerPermisosEfectivos(int idUsuario)
        {
            return await _obtenerPermisosEfectivosBW.ObtenerPermisosEfectivos(idUsuario);
        }
    }
}
