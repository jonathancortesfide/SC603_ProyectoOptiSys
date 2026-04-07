using Microsoft.EntityFrameworkCore;
using Softlithe.ERP.Abstracciones.Contenedores.Marcas;
using Softlithe.ERP.Abstracciones.DA.Marcas;
using Softlithe.ERP.DA.Modelos;

namespace Softlithe.ERP.DA.Marcas
{
    public class ObtenerMarcaDA : IObtenerMarcaDA
    {
        private readonly ContextoBasedeDatos _contextoBasedeDatos;
        public ObtenerMarcaDA(ContextoBasedeDatos contextoBasedeDatos)
        {
            _contextoBasedeDatos = contextoBasedeDatos;
        }
        public async Task<List<MarcaDto>> ObtenerMarcas(string descripcion, int no_empresa)
        {
            try
            {
                List<MarcaDto> lalistaMarca = await (from marca in _contextoBasedeDatos.Marcas
                                                     where EF.Functions.Like(marca.Descripcion ?? string.Empty, "%" + descripcion + "%") && marca.NoEmpresa == no_empresa
                                                     select new MarcaDto
                                                     {
                                                         Descripcion = marca.Descripcion ?? string.Empty,
                                                         NoEmpresa = marca.NoEmpresa,
                                                         NoMarca = marca.NoMarca,
                                                         EsActivo = marca.EsActivo
                                                     }).ToListAsync();
                return lalistaMarca;
            }
            catch (Exception ex)
            {
                throw new Exception("Ocurrió un error al obtener las monedas: " + ex.Message + ". StackTrace: " + ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
            }
        }


    }
}
