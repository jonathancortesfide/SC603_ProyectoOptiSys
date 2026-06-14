using Softlithe.ERP.Abstracciones.Contenedores.Productos;

namespace Softlithe.ERP.Abstracciones.DA.Productos
{
    public interface IProductoRepository
    {
        Task<List<ProductoDto>> ObtenerProductosAsync(int noEmpresa, string? textoBusqueda);

        Task<ProductoDetalleDto?> ObtenerProductoPorIdAsync(int idProducto);

        Task<int> InsertarProductoAsync(ProductoDto productoDto);

        Task<int> ActualizarProductoAsync(ProductoDto productoDto);

        Task<int> ModificaEstadoProductoAsync(ProductoInActivaDto productoInActivaDto);
    }
}
