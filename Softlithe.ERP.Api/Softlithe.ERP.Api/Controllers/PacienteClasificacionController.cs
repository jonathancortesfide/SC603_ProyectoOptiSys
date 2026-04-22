using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Pacientes.ObtenerClasificacionesPorIdentificador;
using Softlithe.ERP.Abstracciones.BW.Pacientes.AgregarClasificacion;
using Softlithe.ERP.Abstracciones.BW.Pacientes.ModificarClasificacion;
using Softlithe.ERP.Abstracciones.BW.Pacientes.CambiarEstadoClasificacion;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PacienteClasificacionController : ControllerBase
    {
        private readonly IObtenerClasificacionesPorIdentificadorBW _obtenerBW;
        private readonly IAgregarClasificacionBW _agregarBW;
        private readonly IModificarClasificacionBW _modificarBW;
        private readonly ICambiarEstadoClasificacionBW _cambiarEstadoBW;

        public PacienteClasificacionController(
            IObtenerClasificacionesPorIdentificadorBW obtenerBW,
            IAgregarClasificacionBW agregarBW,
            IModificarClasificacionBW modificarBW,
            ICambiarEstadoClasificacionBW cambiarEstadoBW)
        {
            _obtenerBW = obtenerBW;
            _agregarBW = agregarBW;
            _modificarBW = modificarBW;
            _cambiarEstadoBW = cambiarEstadoBW;
        }

        // GET: api/PacienteClasificacion/ObtenerPorIdentificador/7
        [HttpGet("ObtenerPorIdentificador/{no_empresa}")]
        [HttpGet("ObtenerPorEmpresa/{no_empresa}")]
        public async Task<PacienteClasificacionConModeloDeValidacion> ObtenerPorIdentificador(int no_empresa)
        {
            return await _obtenerBW.ObtenerPorIdentificador(no_empresa);
        }

        [HttpPost("AgregarClasificacion")]
        public async Task<ModeloValidacion> AgregarClasificacion([FromBody] PacienteClasificacionCrearDto dto)
        {
            return await _agregarBW.Agregar(dto);
        }

        [HttpPost("ModificarClasificacion")]
        public async Task<ModeloValidacion> ModificarClasificacion([FromBody] PacienteClasificacionDto dto)
        {
            return await _modificarBW.Modificar(dto);
        }

        [HttpPost("{no_clasificacion}/estado")]
        public async Task<ModeloValidacion> CambiarEstado(int no_clasificacion, [FromBody] PacienteClasificacionEstadoDto dto)
        {
            return await _cambiarEstadoBW.CambiarEstado(no_clasificacion, dto.usuario, dto.activo);
        }
    }
}
