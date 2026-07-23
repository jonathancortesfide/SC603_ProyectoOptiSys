using Dapper;
using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using Softlithe.ERP.Abstracciones.DA.ConexionALaBaseDeDatos;
using Softlithe.ERP.Abstracciones.DA.Examenes;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Data;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Examenes.ExamenSnapshot
{
    public class ExamenSnapshotAD : IExamenSnapshotAD
    {
        private readonly ContextoBasedeDatos _contexto;


        public ExamenSnapshotAD(ContextoBasedeDatos contexto)
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


        public async Task<ExamenSnapshotDto> Obtener(int noExamen)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();


                var parametros = new DynamicParameters();

                parametros.Add("@no_examen", noExamen);


                return await conexion.QueryFirstOrDefaultAsync<ExamenSnapshotDto>(
                    "sp_ObtenerExamenSnapshot",
                    parametros,
                    commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception ex)
            {
                throw new Exception(
                    "Error al obtener examen snapshot",
                    ex);
            }
        }



        public async Task<bool> Crear(ExamenSnapshotDto modelo)
        {
            try
            {
                var conexion = await ObtenerConexionAsync();


                var parametros = new DynamicParameters();


                parametros.Add("@id_examen", modelo.id_examen);
                parametros.Add("@no_examen", modelo.no_examen);
                parametros.Add("@no_paciente", modelo.no_paciente);

                parametros.Add("@fecha_examen", modelo.fecha_examen);

                parametros.Add("@nombre_paciente", modelo.nombre_paciente);

                parametros.Add("@id_profesional", modelo.id_profesional);
                parametros.Add("@nombre_profesional", modelo.nombre_profesional);
                parametros.Add("@codigo_profesional", modelo.codigo_profesional);

                parametros.Add("@motivo_consulta", modelo.motivo_consulta);
                parametros.Add("@observaciones_generales", modelo.observaciones_generales);

                parametros.Add("@tipo_lente_id", modelo.tipo_lente_id);
                parametros.Add("@tipo_lente", modelo.tipo_lente);

                parametros.Add("@material_id", modelo.material_id);
                parametros.Add("@material", modelo.material);

                parametros.Add("@codigo_aro", modelo.codigo_aro);
                parametros.Add("@aro", modelo.aro);

                parametros.Add("@laboratorio", modelo.laboratorio);

                parametros.Add("@numero_orden_laboratorio", modelo.numero_orden_laboratorio);

                parametros.Add("@disposicion", modelo.disposicion);
                parametros.Add("@tratamiento", modelo.tratamiento);

                parametros.Add("@costo_examen", modelo.costo_examen);
                parametros.Add("@costo_material", modelo.costo_material);
                parametros.Add("@costo_lente", modelo.costo_lente);
                parametros.Add("@costo_aro", modelo.costo_aro);

                parametros.Add("@precio_final", modelo.precio_final);

                parametros.Add("@estado", modelo.estado);

                parametros.Add("@xml_graduaciones", modelo.xml_graduaciones);


                await conexion.ExecuteAsync(
                    "sp_CrearExamenSnapshot",
                    parametros,
                    commandType: CommandType.StoredProcedure
                );


                return true;
            }
            catch (Exception ex)
            {
                throw new Exception(
                    "Error al crear examen snapshot",
                    ex);
            }
        }
    }
}