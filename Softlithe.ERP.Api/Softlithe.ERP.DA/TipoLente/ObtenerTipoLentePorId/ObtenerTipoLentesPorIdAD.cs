using Softlithe.ERP.Abstracciones.Contenedores.TipoLente;
using Softlithe.ERP.Abstracciones.DA.TipoLente.ObtenerTipoLentePorId;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
        public async Task<List<TipoLenteDto>> Obtener(int NoEmpresa) // se busca por el no de empresa 
        {
            try
            {
                List<TipoLenteDto> tipoLenteDtos = (from tipoLentes in _contextoBasedeDatos.TipoLente
                                                     where tipoLentes.NoEmpresa == NoEmpresa
                                                    select new TipoLenteDto
                                                     {
                                                         descripcion = tipoLentes.Descripcion,
                                                         no_tipo = tipoLentes.NoTipo,
                                                         Activo = tipoLentes.Activo,
                                                         no_empresa = tipoLentes.NoEmpresa,
                                                     }).ToList();
                return tipoLenteDtos;
            } 
            catch (Exception ex)
            {
                throw new Exception("Error al obtener los tipos de lentes por ID.", ex);
            }
        }
    }
}
