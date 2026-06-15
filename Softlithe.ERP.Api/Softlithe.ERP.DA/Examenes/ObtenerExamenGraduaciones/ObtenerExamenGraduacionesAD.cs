using Dapper;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using Softlithe.ERP.Abstracciones.DA.Examenes;
using Softlithe.ERP.DA.Modelos;
using System.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;

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
