using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.Pacientes;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;

namespace Softlithe.ERP.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PacienteController : ControllerBase
    {
        private readonly IObtenerPacienteBW _obtenerPacienteBW;
        private readonly IAgregarPacienteBW _agregarPacienteBW;
        private readonly IModificarPacienteBW _modificarPacienteBW;
        private readonly IModificarEstadoPacienteBW _modificarEstadoPacienteBW;

        public PacienteController(
            IObtenerPacienteBW obtenerPacienteBW,
            IAgregarPacienteBW agregarPacienteBW,
            IModificarPacienteBW modificarPacienteBW,
            IModificarEstadoPacienteBW modificarEstadoPacienteBW)
        {
            _obtenerPacienteBW = obtenerPacienteBW;
            _agregarPacienteBW = agregarPacienteBW;
            _modificarPacienteBW = modificarPacienteBW;
            _modificarEstadoPacienteBW = modificarEstadoPacienteBW;
        }

        /// <summary>
        /// Obtiene pacientes del identificador indicado. Sin paginación. Filtros opcionales por cédula y nombre (coincidencia parcial).
        /// </summary>
        [HttpPost("ObtenerPaciente")]
        public async Task<PacienteConModeloDeValidacion> ObtenerPaciente(ParametroConsultaPaciente parametroConsultaPaciente)
        {
            return await _obtenerPacienteBW.ObtenerPacientes(parametroConsultaPaciente);
        }

        /// <summary>
        /// Obtiene un paciente por número de paciente e identificador.
        /// </summary>
        [HttpPost("ObtenerPacientePorId")]
        public async Task<PacientePorIdConModeloDeValidacion> ObtenerPacientePorId(ParametroPacientePorId parametroPacientePorId)
        {
            return await _obtenerPacienteBW.ObtenerPacientePorId(parametroPacientePorId);
        }

        /// <summary>
        /// Inserta un paciente.
        /// </summary>
        [HttpPost("AgregarPaciente")]
        public async Task<ModeloValidacion> AgregarPaciente(PacienteDto parametroPaciente)
        {
            return await _agregarPacienteBW.AgregarPaciente(parametroPaciente);
        }

        /// <summary>
        /// Actualiza un paciente existente.
        /// </summary>
        [HttpPost("ModificarPaciente")]
        public async Task<ModeloValidacion> ModificarPaciente(PacienteDto parametroPaciente)
        {
            return await _modificarPacienteBW.ModificarPaciente(parametroPaciente);
        }

        /// <summary>
        /// Activa o inactiva un paciente.
        /// </summary>
        [HttpPost("ModificarEstadoPaciente")]
        public async Task<ModeloValidacion> ModificarEstadoPaciente(PacienteInActivaDto parametroPaciente)
        {
            return await _modificarEstadoPacienteBW.ModificaEstadoPaciente(parametroPaciente);
        }
    }
}
