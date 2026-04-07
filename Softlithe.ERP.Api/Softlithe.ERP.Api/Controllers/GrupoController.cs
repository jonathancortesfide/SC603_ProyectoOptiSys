using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Grupos.ObtenerGruposPorEmpresa;
using Softlithe.ERP.Abstracciones.BW.Grupos.AgregarGrupo;
using Softlithe.ERP.Abstracciones.BW.Grupos.ModificarGrupo;
using Softlithe.ERP.Abstracciones.BW.Grupos.CambiarEstadoGrupo;
using Softlithe.ERP.Abstracciones.Contenedores.Grupos;
using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GrupoController : ControllerBase
    {
        private readonly IObtenerGruposPorEmpresaBW _obtenerBW;
        private readonly IAgregarGrupoBW _agregarBW;
        private readonly IModificarGrupoBW _modificarBW;
        private readonly ICambiarEstadoGrupoBW _cambiarEstadoBW;

        public GrupoController(
            IObtenerGruposPorEmpresaBW obtenerBW,
            IAgregarGrupoBW agregarBW,
            IModificarGrupoBW modificarBW,
            ICambiarEstadoGrupoBW cambiarEstadoBW)
        {
            _obtenerBW = obtenerBW;
            _agregarBW = agregarBW;
            _modificarBW = modificarBW;
            _cambiarEstadoBW = cambiarEstadoBW;
        }

        // GET: api/Grupo/ObtenerPorEmpresa/1
        [HttpGet("ObtenerPorEmpresa/{no_empresa}")]
        public async Task<GrupoConModeloDeValidacion> ObtenerPorEmpresa(int no_empresa)
        {
            return await _obtenerBW.ObtenerPorEmpresa(no_empresa);
        }

        [HttpPost("AgregarGrupo")]
        public async Task<ModeloValidacion> AgregarGrupo([FromBody] GrupoCrearDto dto)
        {
            return await _agregarBW.Agregar(dto);
        }

        [HttpPost("ModificarGrupo")]
        public async Task<ModeloValidacion> ModificarGrupo([FromBody] GrupoModificarDto dto)
        {
            return await _modificarBW.Modificar(dto);
        }

        [HttpPost("{no_grupo}/estado")]
        public async Task<ModeloValidacion> CambiarEstado(int no_grupo, [FromBody] GrupoEstadoDto dto)
        {
            // identificador will be obtained automatically by DA
            return await _cambiarEstadoBW.CambiarEstado(no_grupo, dto.usuario, dto.activo);
        }
    }
}
