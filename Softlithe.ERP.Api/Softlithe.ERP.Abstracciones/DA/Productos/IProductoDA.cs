using Softlithe.ERP.Abstracciones.Contenedores.Productos;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Productos
{
    public interface IProductoDA
    {
        Task<List<ProductoDto>> ObtenerTodos();
        Task<ProductoDto?> ObtenerPorId(int id);
        Task<int> Crear(ProductoDto producto);
        Task<bool> Actualizar(ProductoDto producto);
        Task<bool> Eliminar(int id);
    }
}