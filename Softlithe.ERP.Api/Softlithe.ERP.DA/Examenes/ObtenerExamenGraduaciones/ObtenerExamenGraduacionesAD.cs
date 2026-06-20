using Dapper;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using Softlithe.ERP.Abstracciones.DA.ConexionALaBaseDeDatos;
using Softlithe.ERP.Abstracciones.DA.Examenes;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Examenes.ObtenerExamenGraduaciones
{
    public class ObtenerExamenGraduacionesAD : IObtenerExamenGraduacionesAD
    {
        private readonly ContextoBasedeDatos _contexto;


        public ObtenerExamenGraduacionesAD(ContextoBasedeDatos contexto)
        {
            _contexto = contexto;
        }

        private async Task<IDbConnection> ObtenerConexionAsync()
        {
            var conexion = _contexto.Database.GetDbConnection();

            if (conexion.State == ConnectionState.Closed)
                await conexion.OpenAsync();

            return conexion;
        }
        public async Task<List<ExamenGraduacionDto>> Obtener(int noPaciente)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@no_paciente", noPaciente);

                using var multi = await conexion.QueryMultipleAsync(
                    "ObtenerExamenGraduaciones",
                    parametros,
                    commandType: CommandType.StoredProcedure);

                // Leer primer resultset (info examen)
                var examen = await multi.ReadFirstOrDefaultAsync();

                // Leer segundo resultset (graduaciones)
                var graduaciones = (await multi.ReadAsync<ExamenGraduacionDto>())
                    .AsList();

                return graduaciones;
            }
            catch (Exception ex)
            {
                throw new Exception(
                    "Error al obtener las graduaciones del examen",
                    ex);
            }
        }
    }
}

