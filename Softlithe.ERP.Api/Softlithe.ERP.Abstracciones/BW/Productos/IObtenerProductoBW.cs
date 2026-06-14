using Softlithe.ERP.Abstracciones.Contenedores.Productos;

namespace Softlithe.ERP.Abstracciones.BW.Productos
{
    public interface IObtenerProductoBW
    {
        Task<ProductoConModeloDeValidacion> ObtenerProductos(ParametroConsultaProducto parametroConsultaProducto);

        Task<ProductoDetalleConModeloDeValidacion> ObtenerProductoPorId(ParametroConsultaProductoPorId parametro);
    }
}
