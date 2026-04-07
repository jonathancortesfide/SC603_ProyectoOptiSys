using Softlithe.ERP.Abstracciones.BW.Productos;
using Softlithe.ERP.Abstracciones.Contenedores.Productos;
using Softlithe.ERP.Abstracciones.DA.Productos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Productos
{
    public class ProductoBW : IProductoBW
    {
        private readonly IProductoDA _productoDA;
        public ProductoBW(IProductoDA productoDA)
        {
            _productoDA = productoDA;
        }
        public Task<List<ProductoDto>> ObtenerTodos() => _productoDA.ObtenerTodos();
        public Task<ProductoDto?> ObtenerPorId(int id) => _productoDA.ObtenerPorId(id);
        public Task<int> Crear(ProductoDto producto) => _productoDA.Crear(producto);
        public Task<bool> Actualizar(ProductoDto producto) => _productoDA.Actualizar(producto);
        public Task<bool> Eliminar(int id) => _productoDA.Eliminar(id);
    }
}