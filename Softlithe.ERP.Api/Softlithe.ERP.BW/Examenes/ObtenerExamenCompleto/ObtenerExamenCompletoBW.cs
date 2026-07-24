using Softlithe.ERP.Abstracciones.BW.Examenes;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using Softlithe.ERP.Abstracciones.DA.Examenes;
using Softlithe.ERP.Abstracciones.DA.Pacientes;
using Microsoft.Extensions.Logging;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;

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

                // Agrupar y ordenar las graduaciones utilizando id_tipo_graduacion y tipo_xml
                // para evitar depender del texto de tipo_graduacion. Mantener estructura de respuesta.
                var graduacionesOrdenadas = graduaciones
                    .OrderBy(g => g.id_tipo_graduacion)
                    .ThenBy(g => g.tipo_xml)
                    .ThenBy(g => g.orden)
                    .ToList();

                respuesta.EsCorrecto = true;
                respuesta.Mensaje = "OK";
                respuesta.Datos = graduacionesOrdenadas;
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
    }
}
