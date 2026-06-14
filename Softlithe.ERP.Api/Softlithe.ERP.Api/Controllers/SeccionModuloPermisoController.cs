using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Seguridad.Secciones;
using Softlithe.ERP.Abstracciones.BW.Seguridad.Modulos;
using Softlithe.ERP.Abstracciones.BW.Seguridad.Permisos;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;

namespace Softlithe.ERP.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SeccionesController : ControllerBase
    {
        private readonly IObtenerSeccionesBW _obtenerSeccionesBW;
        private readonly IAgregarSeccionBW _agregarSeccionBW;
        private readonly IModificarEstadoSeccionBW _modificarEstadoSeccionBW;

        public SeccionesController(
            IObtenerSeccionesBW obtenerSeccionesBW,
            IAgregarSeccionBW agregarSeccionBW,
            IModificarEstadoSeccionBW modificarEstadoSeccionBW)
        {
            _obtenerSeccionesBW = obtenerSeccionesBW;
            _agregarSeccionBW = agregarSeccionBW;
            _modificarEstadoSeccionBW = modificarEstadoSeccionBW;
        }

        [HttpGet]
        public async Task<SeccionConModeloDeValidacion> ObtenerSecciones()
        {
            return await _obtenerSeccionesBW.ObtenerSecciones();
        }

        [HttpPost]
        public async Task<ModeloValidacion> AgregarSeccion([FromBody] AgregarSeccionDto Dto)
        {
            return await _agregarSeccionBW.AgregarSeccion(Dto);
        }

        [HttpPost("estado")]
        public async Task<ModeloValidacion> ModificarEstadoSeccion([FromBody] ModificarEstadoSeccionDto Dto)
        {
            return await _modificarEstadoSeccionBW.ModificarEstadoSeccion(Dto);
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class ModulosController : ControllerBase
    {
        private readonly IObtenerModulosBW _obtenerModulosBW;
        private readonly IAgregarModuloBW _agregarModuloBW;
        private readonly IModificarEstadoModuloBW _modificarEstadoModuloBW;

        public ModulosController(
            IObtenerModulosBW obtenerModulosBW,
            IAgregarModuloBW agregarModuloBW,
            IModificarEstadoModuloBW modificarEstadoModuloBW)
        {
            _obtenerModulosBW = obtenerModulosBW;
            _agregarModuloBW = agregarModuloBW;
            _modificarEstadoModuloBW = modificarEstadoModuloBW;
        }

        [HttpGet]
        public async Task<ModuloConModeloDeValidacion> ObtenerModulos()
        {
            return await _obtenerModulosBW.ObtenerModulos();
        }

        [HttpPost]
        public async Task<ModeloValidacion> AgregarModulo([FromBody] AgregarModuloDto Dto)
        {
            return await _agregarModuloBW.AgregarModulo(Dto);
        }

        [HttpPost("estado")]
        public async Task<ModeloValidacion> ModificarEstadoModulo([FromBody] ModificarEstadoModuloDto Dto)
        {
            return await _modificarEstadoModuloBW.ModificarEstadoModulo(Dto);
        }
    }

    [Route("api/[controller]")]
    [ApiController]
    public class PermisosController : ControllerBase
    {
        private readonly IObtenerPermisosBW _obtenerPermisosBW;
        private readonly IAgregarPermisoBW _agregarPermisoBW;
        private readonly IModificarEstadoPermisoBW _modificarEstadoPermisoBW;

        public PermisosController(
            IObtenerPermisosBW obtenerPermisosBW,
            IAgregarPermisoBW agregarPermisoBW,
            IModificarEstadoPermisoBW modificarEstadoPermisoBW)
        {
            _obtenerPermisosBW = obtenerPermisosBW;
            _agregarPermisoBW = agregarPermisoBW;
            _modificarEstadoPermisoBW = modificarEstadoPermisoBW;
        }

        [HttpGet]
        public async Task<PermisoConModeloDeValidacion> ObtenerPermisos()
        {
            return await _obtenerPermisosBW.ObtenerPermisos();
        }

        [HttpPost]
        public async Task<ModeloValidacion> AgregarPermiso([FromBody] AgregarPermisoDto Dto)
        {
            return await _agregarPermisoBW.AgregarPermiso(Dto);
        }

        [HttpPost("estado")]
        public async Task<ModeloValidacion> ModificarEstadoPermiso([FromBody] ModificarEstadoPermisoDto Dto)
        {
            return await _modificarEstadoPermisoBW.ModificarEstadoPermiso(Dto);
        }
    }
}
