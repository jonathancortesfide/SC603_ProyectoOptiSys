using Microsoft.Extensions.Logging;
using Softlithe.ERP.Abstracciones.BW.Examenes;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using Softlithe.ERP.Abstracciones.DA.Examenes;
using System;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Examenes.ExamenSnapshot
{
    public class ExamenSnapshotBW : IExamenSnapshotBW
    {
        private readonly IExamenSnapshotAD _examenSnapshotAD;
        private readonly ILogger<ExamenSnapshotBW> _logger;


        public ExamenSnapshotBW(
            IExamenSnapshotAD examenSnapshotAD,
            ILogger<ExamenSnapshotBW> logger)
        {
            _examenSnapshotAD = examenSnapshotAD;
            _logger = logger;
        }


        public async Task<ModeloValidacionConDatos<ExamenSnapshotDto>> ObtenerPorNoExamen(int noExamen)
        {
            var respuesta = new ModeloValidacionConDatos<ExamenSnapshotDto>
            {
                Mensaje = string.Empty,
                EsCorrecto = false,
                Datos = null
            };

            try
            {
                var examenSnapshot = await _examenSnapshotAD.Obtener(noExamen);


                if (examenSnapshot == null)
                {
                    respuesta.Mensaje = "No se encontró información del examen.";
                    return respuesta;
                }


                respuesta.EsCorrecto = true;
                respuesta.Mensaje = "OK";
                respuesta.Datos = examenSnapshot;

                return respuesta;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error al obtener examen snapshot por número de examen: {noExamen}",
                    noExamen);


                respuesta.EsCorrecto = false;
                respuesta.Mensaje = "Error interno al obtener el examen.";
                respuesta.Datos = null;

                return respuesta;
            }
        }



        public async Task<ModeloValidacionConDatos<bool>> Crear(ExamenSnapshotDto examenSnapshot)
        {
            var respuesta = new ModeloValidacionConDatos<bool>
            {
                Mensaje = string.Empty,
                EsCorrecto = false,
                Datos = false
            };


            try
            {
                if (examenSnapshot == null)
                {
                    respuesta.Mensaje = "La información del examen no puede ser nula.";
                    return respuesta;
                }


                var resultado = await _examenSnapshotAD.Crear(examenSnapshot);


                if (!resultado)
                {
                    respuesta.Mensaje = "No se pudo crear el snapshot del examen.";
                    return respuesta;
                }


                respuesta.EsCorrecto = true;
                respuesta.Mensaje = "Examen snapshot creado correctamente.";
                respuesta.Datos = true;


                return respuesta;
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Error al crear examen snapshot");


                respuesta.EsCorrecto = false;
                respuesta.Mensaje = "Error interno al crear examen snapshot.";
                respuesta.Datos = false;

                return respuesta;
            }
        }
    }
}