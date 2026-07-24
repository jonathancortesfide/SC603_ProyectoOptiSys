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
                // Mapear al DTO ExamenDto para mantener compatibilidad con la estructura de la respuesta
                var examen = await multi.ReadFirstOrDefaultAsync<Softlithe.ERP.Abstracciones.Contenedores.Examenes.ExamenDto>();

                // Leer segundo resultset (graduaciones)
                // Dapper mapeará automáticamente las columnas a las propiedades del DTO actualizado
                var graduaciones = (await multi.ReadAsync<Softlithe.ERP.Abstracciones.Contenedores.Examenes.ExamenGraduacionDto>())
                    .AsList();

                // Si es necesario, establecer valores derivados o normalizados aquí (no cambiar lógica de negocio)
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

