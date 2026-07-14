using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Logging;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using Softlithe.ERP.Abstracciones.DA.ConexionALaBaseDeDatos;
using Softlithe.ERP.Abstracciones.DA.Examenes.AgregarExamen;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Examenes.AgregarExamen
{
	public class AgregarExamenDA : IAgregarExamenDA
	{
		private readonly IConexionABaseDeDatos _conexionABaseDeDatos;
		private readonly ILogger<AgregarExamenDA> _logger;

		public AgregarExamenDA(IConexionABaseDeDatos conexionABaseDeDatos, ILogger<AgregarExamenDA> logger)
		{
			_conexionABaseDeDatos = conexionABaseDeDatos;
			_logger = logger;
		}
        public async Task<int> ObtenerProximoNumeroExamen(int identificador)
        {
            try
            {
                using (IDbConnection dbConnection = new SqlConnection(_conexionABaseDeDatos.ObtenerCadenaDeConexion()))
                {
                    string sql = "SELECT ISNULL(MAX(no_examen), 0) FROM Examen WHERE identificador = @identificador";
                    int maximo = await dbConnection.QuerySingleAsync<int>(sql, new { identificador });
                    return maximo + 1;
                }
            }
            catch (Exception ex)
            {
                return -1;
            }
            }
            public async Task<int> Agregar(AgregarExamenDto datos)
            {
                try
                {
                    using (IDbConnection dbConnection = new SqlConnection(_conexionABaseDeDatos.ObtenerCadenaDeConexion()))
                    {
                        DynamicParameters parameters = ObtenerParametrosDeRegistro(datos);

                        _logger.LogInformation("Ejecutando CrearExamenSP");

                        _logger.LogInformation(
                            "NoExamen={NoExamen}, NoPaciente={NoPaciente}, Fecha={FechaExamen}",
                            datos.NoExamen,
                            datos.NoPaciente,
                            datos.FechaExamen);

                        _logger.LogInformation(
                            "Profesional={IdProfesional}, Empresa={NumeroEmpresa}, Identificador={Identificador}",
                            datos.IdProfesional,
                            datos.NumeroEmpresa,
                            datos.Identificador);

                        _logger.LogInformation(
                            "Motivo={Motivo}, TipoLente={TipoLente}, Material={Material}, Aro={Aro}",
                            datos.MotivoDeConsulta,
                            datos.TipoLente,
                            datos.Material,
                            datos.Aro);

                        _logger.LogDebug("XmlGraduaciones: {XmlGraduaciones}", datos.XmlGraduaciones);

                        int numeroDeExamen = await dbConnection.QuerySingleOrDefaultAsync<int>(
                            "[dbo].[CrearExamenSP]",
                            parameters,
                            commandType: CommandType.StoredProcedure);

                        _logger.LogInformation("Examen creado correctamente. Resultado={NumeroExamen}", numeroDeExamen);

                        return numeroDeExamen;
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error al agregar examen");

                    throw;
                }
            }

        private DynamicParameters ObtenerParametrosDeRegistro(AgregarExamenDto datos)
        {
            DynamicParameters parameters = new DynamicParameters();

            parameters.Add("@NoExamen", datos.NoExamen);
            parameters.Add("@FechaExamen", datos.FechaExamen);
            parameters.Add("@NoPaciente", datos.NoPaciente);

            parameters.Add("@MotivoDeConsulta", datos.MotivoDeConsulta);

            parameters.Add("@CodigoProfesional", datos.CodigoProfesional);

            parameters.Add("@ObservacionesGenerales", datos.ObservacionesGenerales);
            parameters.Add("@XmlGraduaciones", datos.XmlGraduaciones);

            // Lentes
            parameters.Add("@TipoLente", datos.TipoLente);
            parameters.Add("@TipoLenteId", datos.TipoLenteId);

            parameters.Add("@Material", datos.Material);
            parameters.Add("@MaterialId", datos.MaterialId);

            parameters.Add("@Aro", datos.Aro);
            parameters.Add("@CodigoAro", datos.CodigoAro);

            // Laboratorio
            parameters.Add("@Laboratorio", datos.Laboratorio);
            parameters.Add("@NumeroOrdenLaboratorio", datos.NumeroOrdenLaboratorio);
            parameters.Add("@NumeroPedidoLaboratorio", datos.NumeroPedidoLaboratorio);

            // Diseño
            parameters.Add("@Disposicion", datos.Disposicion);
            parameters.Add("@Tratamiento", datos.Tratamiento);

            // Costos
            parameters.Add("@CostoAro", datos.CostoAro);
            parameters.Add("@CostoLente", datos.CostoLente);
            parameters.Add("@CostoMaterial", datos.CostoMaterial);
            parameters.Add("@CostoExamen", datos.CostoExamen);
            parameters.Add("@PrecioFinal", datos.PrecioFinal);

            // Generales
            parameters.Add("@IdProfesional", datos.IdProfesional);
            parameters.Add("@Identificador", datos.Identificador);

            parameters.Add("@NombrePaciente", datos.NombrePaciente);
            parameters.Add("@NombreProfesional", datos.NombreProfesional);

            parameters.Add("@NumeroEmpresa", datos.NumeroEmpresa);

            return parameters;
        }
    }
}
