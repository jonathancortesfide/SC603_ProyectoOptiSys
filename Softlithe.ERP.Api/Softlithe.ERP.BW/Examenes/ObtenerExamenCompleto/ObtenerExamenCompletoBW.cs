using Softlithe.ERP.Abstracciones.BW.Examenes;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using Softlithe.ERP.Abstracciones.DA.Examenes;
using Softlithe.ERP.Abstracciones.DA.Pacientes;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace Softlithe.ERP.BW.Examenes.ObtenerExamenCompleto
{
    public class ObtenerExamenCompletoBW : IObtenerExamenCompletoBW
    {
        private readonly IObtenerExamenGraduacionesAD _obtenerExamenGraduacionesAD;
        private readonly IPacienteRepository _pacienteRepository;
        private readonly ILogger<ObtenerExamenCompletoBW> _logger;

        public ObtenerExamenCompletoBW(IObtenerExamenGraduacionesAD obtenerExamenGraduacionesAD, IPacienteRepository pacienteRepository, ILogger<ObtenerExamenCompletoBW> logger)
        {
            _obtenerExamenGraduacionesAD = obtenerExamenGraduacionesAD;
            _pacienteRepository = pacienteRepository;
            _logger = logger;
        }

        public async Task<ModeloValidacionConDatos<List<ExamenGraduacionDto>>> ObtenerPorNoPaciente(int noPaciente)
        {
            var respuesta = new ModeloValidacionConDatos<List<ExamenGraduacionDto>>
            {
                Mensaje = string.Empty,
                EsCorrecto = false,
                Datos = new List<ExamenGraduacionDto>()
            };
            try
            {
                var graduaciones = await _obtenerExamenGraduacionesAD.Obtener(noPaciente);

                respuesta.EsCorrecto = true;                                                                      
                respuesta.Mensaje = "OK";
                respuesta.Datos = graduaciones;
                return respuesta;
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error al obtener examen completo por paciente");
                respuesta.EsCorrecto = false;
                respuesta.Mensaje = "Error interno al obtener examen.";
                respuesta.Datos = new List<ExamenGraduacionDto>();
                return respuesta;
            }
        }

        public async Task<ModeloValidacionConDatos<List<ExamenGraduacionDto>>> ObtenerPorNumeroExamen(int noExamen)
        {
            var respuesta = new ModeloValidacionConDatos<List<ExamenGraduacionDto>>
            {
                Mensaje = string.Empty,
                EsCorrecto = false,
                Datos = new List<ExamenGraduacionDto>()
            };
            try
            {
                var graduaciones = await _obtenerExamenGraduacionesAD.ObtenerPorNumeroExamen(noExamen);

                respuesta.EsCorrecto = true;
                respuesta.Mensaje = "OK";
                respuesta.Datos = graduaciones;
                return respuesta;
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error al obtener examen por número");
                respuesta.EsCorrecto = false;
                respuesta.Mensaje = "Error interno al obtener examen.";
                respuesta.Datos = new List<ExamenGraduacionDto>();
                return respuesta;
            }
        }

        public async Task<ModeloValidacionConDatos<List<ExamenGraduacionDto>>> ObtenerPorCriterios(int? noExamen, int? noPaciente)
        {
            var respuesta = new ModeloValidacionConDatos<List<ExamenGraduacionDto>>
            {
                Mensaje = string.Empty,
                EsCorrecto = false,
                Datos = new List<ExamenGraduacionDto>()
            };
            try
            {
                var graduaciones = await _obtenerExamenGraduacionesAD.ObtenerPorCriterios(noExamen, noPaciente);

                respuesta.EsCorrecto = true;
                respuesta.Mensaje = "OK";
                respuesta.Datos = graduaciones;
                return respuesta;
            }
            catch (System.Exception ex)
            {
                _logger.LogError(ex, "Error al obtener examen por criterios");
                respuesta.EsCorrecto = false;
                respuesta.Mensaje = "Error interno al obtener examen.";
                respuesta.Datos = new List<ExamenGraduacionDto>();
                return respuesta;
            }
        }
    }
}
