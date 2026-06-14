using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Productos;

namespace Softlithe.ERP.Abstracciones.BW.Productos
{
    public interface IAgregarProductoBW
    {
        Task<ModeloValidacion> AgregarProducto(ProductoDto productoDto);
    }
}
