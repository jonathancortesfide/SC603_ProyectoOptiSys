using Softlithe.ERP.Abstracciones.Contenedores;

namespace Softlithe.ERP.Abstracciones.BW.Productos
{
    public interface IEliminarProductoBW
    {
        Task<ModeloValidacion> EliminarProducto(int idProducto);
    }
}
