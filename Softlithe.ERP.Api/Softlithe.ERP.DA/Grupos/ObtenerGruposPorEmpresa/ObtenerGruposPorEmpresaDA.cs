using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Grupos;
using Softlithe.ERP.Abstracciones.DA.Grupos.ObtenerGruposPorEmpresa;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Grupos.ObtenerGruposPorEmpresa
{
    public class ObtenerGruposPorEmpresaDA : IObtenerGruposPorEmpresaDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;

        public ObtenerGruposPorEmpresaDA(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }

        public async Task<List<GrupoDto>> ObtenerPorEmpresa(int no_empresa)
        {
            try
            {
                var lista = await (from g in _contextoBasedeDatos.Set<Grupo>()
                                   where g.no_empresa == no_empresa
                                   select new GrupoDto
                                   {
                                       no_grupo = g.no_grupo,
                                       Descripcion = g.Descripcion,
                                       no_empresa = g.no_empresa,
                                       activo = g.activo
                                   }).ToListAsync();

                return lista;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al obtener los grupos: " + ex.Message + ". StackTrace: " + ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
            }
        }
    }
}
