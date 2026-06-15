using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using Softlithe.ERP.Abstracciones.DA.ConexionALaBaseDeDatos;
using Softlithe.ERP.Abstracciones.DA.Examenes;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Examenes.ObtenerExamenCompleto
{
    public class ObtenerExamenGraduacionesAD : IObtenerExamenGraduacionesAD
    {
        private readonly IConexionABaseDeDatos _conexionABaseDeDatos;
        private readonly ILogger<ObtenerExamenGraduacionesAD> _logger;

        public ObtenerExamenGraduacionesAD(IConexionABaseDeDatos conexionABaseDeDatos, ILogger<ObtenerExamenGraduacionesAD> logger)
        {
            _conexionABaseDeDatos = conexionABaseDeDatos;
            _logger = logger;
        }

        public async Task<List<ExamenGraduacionDto>> Obtener(int noPaciente)
        {
            try
            {
                using (IDbConnection dbConnection = new SqlConnection(_conexionABaseDeDatos.ObtenerCadenaDeConexion()))
                {
                    dbConnection.Open();
                    
                    // Query to get all exams for a patient with patient name
                    string query = @"
                        SELECT 
                            e.id_examen as id_graduacion,
                            CAST(e.no_examen AS VARCHAR(50)) as abreviatura,
                            CAST(e.no_paciente AS DECIMAL(18,2)) as resultado_valor,
                            FORMAT(e.fecha_examen, 'yyyy-MM-dd') as posicion,
                            e.motivo as posicion_nombre,
                            ISNULL(p.nombre, '') as nombrePaciente
                        FROM [dbo].[Examen] e
                        LEFT JOIN [dbo].[Paciente] p ON e.no_paciente = p.no_paciente
                        WHERE e.no_paciente = @noPaciente
                        ORDER BY e.fecha_examen DESC";

                    var exams = (await dbConnection.QueryAsync<ExamenGraduacionDto>(
                        query,
                        new { noPaciente },
                        commandType: CommandType.Text
                    )).ToList();

                    _logger.LogInformation($"Se obtuvieron {exams.Count} exámenes para el paciente {noPaciente}");
                    return exams;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener exámenes del paciente {noPaciente}: {ex.Message}");
                _logger.LogError($"Stack trace: {ex.StackTrace}");
                return new List<ExamenGraduacionDto>();
            }
        }

        public async Task<List<ExamenGraduacionDto>> ObtenerPorNumeroExamen(int noExamen)
        {
            try
            {
                using (IDbConnection dbConnection = new SqlConnection(_conexionABaseDeDatos.ObtenerCadenaDeConexion()))
                {
                    dbConnection.Open();

                    string query = @"
                        SELECT 
                            e.id_examen as id_graduacion,
                            CAST(e.no_examen AS VARCHAR(50)) as abreviatura,
                            CAST(e.no_paciente AS DECIMAL(18,2)) as resultado_valor,
                            FORMAT(e.fecha_examen, 'yyyy-MM-dd') as posicion,
                            e.motivo as posicion_nombre,
                            ISNULL(p.nombre, '') as nombrePaciente
                        FROM [dbo].[Examen] e
                        LEFT JOIN [dbo].[Paciente] p ON e.no_paciente = p.no_paciente
                        WHERE e.no_examen = @noExamen
                        ORDER BY e.fecha_examen DESC";

                    var exams = (await dbConnection.QueryAsync<ExamenGraduacionDto>(
                        query,
                        new { noExamen },
                        commandType: CommandType.Text
                    )).ToList();

                    _logger.LogInformation($"Se obtuvieron {exams.Count} exámenes con número {noExamen}");
                    return exams;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener examen número {noExamen}: {ex.Message}");
                _logger.LogError($"Stack trace: {ex.StackTrace}");
                return new List<ExamenGraduacionDto>();
            }
        }

        public async Task<List<ExamenGraduacionDto>> ObtenerPorCriterios(int? noExamen, int? noPaciente)
        {
            try
            {
                using (IDbConnection dbConnection = new SqlConnection(_conexionABaseDeDatos.ObtenerCadenaDeConexion()))
                {
                    dbConnection.Open();

                    string query = @"
                        SELECT 
                            e.id_examen as id_graduacion,
                            CAST(e.no_examen AS VARCHAR(50)) as abreviatura,
                            CAST(e.no_paciente AS DECIMAL(18,2)) as resultado_valor,
                            FORMAT(e.fecha_examen, 'yyyy-MM-dd') as posicion,
                            e.motivo as posicion_nombre,
                            ISNULL(p.nombre, '') as nombrePaciente
                        FROM [dbo].[Examen] e
                        LEFT JOIN [dbo].[Paciente] p ON e.no_paciente = p.no_paciente
                        WHERE 1=1";

                    var parameters = new DynamicParameters();

                    if (noExamen.HasValue && noExamen.Value > 0)
                    {
                        query += " AND e.no_examen = @noExamen";
                        parameters.Add("@noExamen", noExamen.Value);
                    }

                    if (noPaciente.HasValue && noPaciente.Value > 0)
                    {
                        query += " AND e.no_paciente = @noPaciente";
                        parameters.Add("@noPaciente", noPaciente.Value);
                    }

                    query += " ORDER BY e.fecha_examen DESC";

                    var exams = (await dbConnection.QueryAsync<ExamenGraduacionDto>(
                        query,
                        parameters,
                        commandType: CommandType.Text
                    )).ToList();

                    _logger.LogInformation($"Se obtuvieron {exams.Count} exámenes con criterios: NoExamen={noExamen}, NoPaciente={noPaciente}");
                    return exams;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error al obtener exámenes por criterios: {ex.Message}");
                _logger.LogError($"Stack trace: {ex.StackTrace}");
                return new List<ExamenGraduacionDto>();
            }
        }
    }
}
