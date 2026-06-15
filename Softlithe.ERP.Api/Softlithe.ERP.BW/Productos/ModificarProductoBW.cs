using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Productos;
using Softlithe.ERP.Abstracciones.BC.Productos;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.Productos;
using Softlithe.ERP.Abstracciones.DA.Productos;

namespace Softlithe.ERP.BW.Productos
{
    public class ModificarProductoBW : IModificarProductoBW
    {
        private readonly IProductoRepository _productoRepository;
        private readonly IProductoBC _productoBC;
        private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
        private readonly IErrorLogger _logger;

        public ModificarProductoBW(
            IProductoRepository productoRepository,
            IProductoBC productoBC,
            IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
            IErrorLogger errorLogger)
        {
            _productoRepository = productoRepository;
            _productoBC = productoBC;
            _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
            _logger = errorLogger;
        }

        public async Task<ModeloValidacion> ModificarProducto(ProductoDto productoDto)
        {
            try
            {
                var validacion = await _productoBC.ValidarProductoParaActualizar(productoDto);
                if (!validacion.EsCorrecto)
                {
                    return validacion;
                }

                int resultadoActualizacion = await _productoRepository.ActualizarProductoAsync(productoDto);
                int respuestaBitacora = await AgregarEventoBitacoraCorrecto(productoDto, resultadoActualizacion);

                return ConstruirRespuestaExitosa(resultadoActualizacion, respuestaBitacora);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaExitosa(0, 1);
            }
        }

        private ModeloValidacion ConstruirRespuestaExitosa(int resultadoActualizacion, int errorBitacora)
        {
            return new ModeloValidacion
            {
                Mensaje = (resultadoActualizacion > 0 ? string.Format(MensajeDeProductoDto.ProductoModificadoCorrectamente, "") : MensajeDeProductoDto.ProductoNoGuardar) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
                EsCorrecto = resultadoActualizacion > 0
            };
        }

        private async Task<int> AgregarEventoBitacoraCorrecto(ProductoDto productoDto, int resultadoActualizacion)
        {
            return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
            {
                descripcionDelEvento = resultadoActualizacion > 0 ? string.Format(MensajeDeProductoDto.ProductoModificadoCorrectamente, productoDto.descripcion) + ". Id: " + productoDto.IdProducto : MensajeDeProductoDto.ProductoNoGuardar + ". Id: " + productoDto.IdProducto,
                fechaDeRegistro = DateTime.Now,
                nombreDelMetodo = nameof(ModificarProducto),
                tabla = "Producto",
                idBitacora = Guid.NewGuid(),
                identificador = productoDto.Identificador,
                usuario = productoDto.Usuario
            });
        }
    }
}
