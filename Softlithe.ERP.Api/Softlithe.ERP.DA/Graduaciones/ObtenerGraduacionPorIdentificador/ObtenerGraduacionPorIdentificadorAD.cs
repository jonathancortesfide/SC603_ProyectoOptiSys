using Dapper;
using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Graduaciones;
using Softlithe.ERP.Abstracciones.DA.Graduaciones.ObtenerGraduacionPorIdentificador;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Graduaciones.ObtenerGraduacionPorIdentificador
{
    public class ObtenerGraduacionPorIdentificadorAD : IObtenerGraduacionPorIdentificadorAD
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;

        public ObtenerGraduacionPorIdentificadorAD(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }
        public async Task<GraduacionAgrupadaDto> Obtener(int identificador)
        {
            try
            {
                var conexion = _contextoBasedeDatos.Database.GetDbConnection();

                if (conexion.State == ConnectionState.Closed)
                    await conexion.OpenAsync();

                var parametros = new DynamicParameters();
                parametros.Add("@identificador", identificador);

                var datos = (await conexion.QueryAsync<ObtenerGraduacionPorSucursalSPDto>(
                    "sp_ObtenerGraduacionesPorSucursal",
                    parametros,
                    commandType: CommandType.StoredProcedure)).ToList();

                var resultado = new GraduacionAgrupadaDto
                {
                    TiposGraduacion = datos

                        .GroupBy(g => new
                        {
                            g.IdTipoGraduacion,
                            g.TipoGraduacion
                        })

                        .Select(grupo => new TipoGraduacionDto
                        {
                            IdTipoGraduacion = grupo.Key.IdTipoGraduacion,

                            NombreTipoGraduacion = grupo.Key.TipoGraduacion?.Trim(),

                            Graduaciones = grupo.Select(g => new GraduacionDto
                            {
                                IdGraduacion = g.IdGraduacion,

                                Identificador = g.Identificador,

                                Nombre = g.Nombre?.Trim(),

                                Abreviatura = g.Abreviatura?.Trim(),

                                DescripcionTecnica = g.DescripcionTecnica,

                                Orden = g.Orden,

                                Activo = g.Activo,

                                IdTipoGraduacion = g.IdTipoGraduacion
                            }).ToList()

                        }).ToList()
                };

                return resultado;
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener las graduaciones.", ex);
            }
        }
    }
}