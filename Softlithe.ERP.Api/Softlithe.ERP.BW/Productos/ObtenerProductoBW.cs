using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Productos;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.Productos;
using Softlithe.ERP.Abstracciones.DA.Productos;

namespace Softlithe.ERP.BW.Productos
{
    public class ObtenerProductoBW : IObtenerProductoBW
    {
        private readonly IProductoRepository _productoRepository;
        private readonly IErrorLogger _logger;

        public ObtenerProductoBW(IProductoRepository productoRepository, IErrorLogger errorLogger)
        {
            _productoRepository = productoRepository;
            _logger = errorLogger;
        }

        public async Task<ProductoConModeloDeValidacion> ObtenerProductosMT(int noEmpresa, int noTipo)
        {
            try
            {
                List<ProductoDto> productos = await _productoRepository.ObtenerProductosMTAsync(noEmpresa, noTipo);
                return ConstruirRespuestaListaExitosa(productos);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaListaExitosa(null);
            }
        }

        public async Task<ProductoConModeloDeValidacion> ObtenerProductosAR(int noEmpresa, string descripcion)
        {
            try
            {
                List<ProductoDto> productos = await _productoRepository.ObtenerProductosARAsync(noEmpresa, descripcion);
                return ConstruirRespuestaListaExitosa(productos);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaListaExitosa(null);
            }
        }
        public async Task<ProductoConModeloDeValidacion> ObtenerProductos(ParametroConsultaProducto parametroConsultaProducto)
        {
            try
            {
                List<ProductoDto> productos = await _productoRepository.ObtenerProductosAsync(
                    parametroConsultaProducto.NoEmpresa,
                    parametroConsultaProducto.TextoBusqueda);

                return ConstruirRespuestaListaExitosa(productos);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaListaExitosa(null);
            }
        }

        public async Task<ProductoDetalleConModeloDeValidacion> ObtenerProductoPorId(ParametroConsultaProductoPorId parametro)
        {
            try
            {
                ProductoDetalleDto? producto = await _productoRepository.ObtenerProductoPorIdAsync(
                    parametro.IdProducto);

                if (producto == null)
                {
                    return new ProductoDetalleConModeloDeValidacion
                    {
                        Producto = null,
                        Mensaje = "No se encontró el producto solicitado.",
                        EsCorrecto = false,
                    };
                }

                return ConstruirRespuestaDetalleExitosa(producto);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaDetalleExitosa(null);
            }
        }

        private ProductoConModeloDeValidacion ConstruirRespuestaListaExitosa(List<ProductoDto>? lista)
        {
            return new ProductoConModeloDeValidacion
            {
                LaListaDeProductos = lista ?? new List<ProductoDto>(),
                Mensaje = lista == null ? MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema : MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = lista != null,
            };
        }

        private ProductoDetalleConModeloDeValidacion ConstruirRespuestaDetalleExitosa(ProductoDetalleDto? producto)
        {
            return new ProductoDetalleConModeloDeValidacion
            {
                Producto = producto,
                Mensaje = producto == null ? MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema : MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = producto != null,
            };
        }
    }
}
