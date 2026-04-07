using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.DA.Pacientes.ObtenerClasificacionesPorIdentificador;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Pacientes.ObtenerClasificacionesPorIdentificador
{
    public class ObtenerClasificacionesPorIdentificadorDA : IObtenerClasificacionesPorIdentificadorDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;

        public ObtenerClasificacionesPorIdentificadorDA(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }

        public async Task<List<PacienteClasificacionDto>> ObtenerPorIdentificador(int identificador)
        {
            try
            {
                var query = _contextoBasedeDatos.PacienteClasificaciones.AsQueryable();

                query = query.Where(x => x.identificador == identificador);

                var lista = await query.Select(x => new PacienteClasificacionDto
                {
                    no_clasificacion = x.no_clasificacion,
                    descripcion = x.descripcion,
                    identificador = x.identificador,
                    activo = x.activo
                }).ToListAsync();

                return lista;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al obtener las clasificaciones: " + ex.Message + ". StackTrace: " + ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
            }
        }
    }
}
