using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Productos;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Productos;

namespace Softlithe.ERP.BW.Productos
{
    public class EliminarProductoBW : IEliminarProductoBW
    {
        private readonly IProductoRepository _productoRepository;
        private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
        private readonly IErrorLogger _logger;

        public EliminarProductoBW(
            IProductoRepository productoRepository,
            IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
            IErrorLogger errorLogger)
        {
            _productoRepository = productoRepository;
            _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
            _logger = errorLogger;
        }

        public async Task<ModeloValidacion> EliminarProducto(int idProducto)
        {
            try
            {
                if (idProducto <= 0)
                {
                    return new ModeloValidacion
                    {
                        Mensaje = "El ID del producto es requerido",
                        EsCorrecto = false
                    };
                }

                int resultadoEliminacion = await _productoRepository.EliminarProductoAsync(idProducto);
                int respuestaBitacora = await AgregarEventoBitacoraEliminacion(idProducto, resultadoEliminacion);

                return ConstruirRespuestaExitosa(resultadoEliminacion, respuestaBitacora);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return new ModeloValidacion
                {
                    Mensaje = "Error al eliminar el producto",
                    EsCorrecto = false
                };
            }
        }

        private ModeloValidacion ConstruirRespuestaExitosa(int resultadoEliminacion, int errorBitacora)
        {
            return new ModeloValidacion
            {
                Mensaje = (resultadoEliminacion > 0 ? "Producto eliminado correctamente" : "No se pudo eliminar el producto") 
                    + (errorBitacora == 0 ? " (error en bitácora)" : ""),
                EsCorrecto = resultadoEliminacion > 0
            };
        }

        private async Task<int> AgregarEventoBitacoraEliminacion(int idProducto, int resultadoEliminacion)
        {
            return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
            {
                descripcionDelEvento = resultadoEliminacion > 0 
                    ? $"Producto eliminado correctamente. ID: {idProducto}" 
                    : $"Error al eliminar producto. ID: {idProducto}",
                fechaDeRegistro = DateTime.Now,
                nombreDelMetodo = nameof(EliminarProducto),
                tabla = "Producto",
                idBitacora = Guid.NewGuid(),
                identificador = 1,
                usuario = "sistema"
            });
        }
    }
}
