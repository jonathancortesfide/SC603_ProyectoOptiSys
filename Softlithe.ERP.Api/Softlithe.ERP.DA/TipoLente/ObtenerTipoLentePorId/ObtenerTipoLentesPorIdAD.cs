using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.TipoLente;
using Softlithe.ERP.Abstracciones.DA.TipoLente.ObtenerTipoLentePorId;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.TipoLente.ObtenerTipoLentePorId
{
    public class ObtenerTipoLentesPorIdAD : IObtenerTipoLentesPorIdAD
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;

        public ObtenerTipoLentesPorIdAD(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }

        public async Task<List<TipoLenteDto>> Obtener(string descripcion, int identificador)
            {
            try
            {
                var query = from tipoLentes in _contextoBasedeDatos.TipoLente
                            where tipoLentes.NoEmpresa == identificador
                                  && (string.IsNullOrEmpty(descripcion)
                                      || EF.Functions.Like(tipoLentes.Descripcion, $"%{descripcion}%"))
                            select new TipoLenteDto
                            {
                                descripcion = tipoLentes.Descripcion,
                                no_tipo = tipoLentes.NoTipo,
                                Activo = tipoLentes.Activo,
                                no_empresa = tipoLentes.NoEmpresa,
                            };

                return await query.ToListAsync();
            }
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los tipos de lentes por descripción.", ex);
            }
        }
    }
}
