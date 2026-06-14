using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Productos;

namespace Softlithe.ERP.Abstracciones.BW.Productos
{
    public interface IModificarProductoBW
    {
        Task<ModeloValidacion> ModificarProducto(ProductoDto productoDto);
    }
}
