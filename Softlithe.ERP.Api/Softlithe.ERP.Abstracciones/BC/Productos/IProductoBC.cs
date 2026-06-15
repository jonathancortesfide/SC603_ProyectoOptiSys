using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Productos;

namespace Softlithe.ERP.Abstracciones.BC.Productos
{
    public interface IProductoBC
    {
        Task<ModeloValidacion> ValidarProductoParaInsertar(ProductoDto productoDto);

        Task<ModeloValidacion> ValidarProductoParaActualizar(ProductoDto productoDto);

        Task<ModeloValidacion> ValidarProductoParaCambiarEstado(ProductoInActivaDto productoInActivaDto);
    }
}
