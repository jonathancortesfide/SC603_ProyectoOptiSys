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
    public class AgregarProductoBW : IAgregarProductoBW
    {
        private readonly IProductoRepository _productoRepository;
        private readonly IProductoBC _productoBC;
        private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
        private readonly IErrorLogger _logger;

        public AgregarProductoBW(
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

        public async Task<ModeloValidacion> AgregarProducto(ProductoDto productoDto)
        {
            try
            {
                var validacion = await _productoBC.ValidarProductoParaInsertar(productoDto);
                if (!validacion.EsCorrecto)
                {
                    return validacion;
                }

                int resultadoInsercion = await _productoRepository.InsertarProductoAsync(productoDto);
                int respuestaBitacora = await AgregarEventoBitacoraCorrecto(productoDto, resultadoInsercion);

                return ConstruirRespuestaExitosa(resultadoInsercion, respuestaBitacora);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaExitosa(0, 1);
            }
        }

        private ModeloValidacion ConstruirRespuestaExitosa(int resultadoInsercion, int errorBitacora)
        {
            return new ModeloValidacion
            {
                Mensaje = (resultadoInsercion > 0 ? string.Format(MensajeDeProductoDto.ProductoAgregadoCorrectamente, "") : MensajeDeProductoDto.ProductoNoGuardar) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
                EsCorrecto = resultadoInsercion > 0
            };
        }

        private async Task<int> AgregarEventoBitacoraCorrecto(ProductoDto productoDto, int resultadoInsercion)
        {
            return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
            {
                descripcionDelEvento = resultadoInsercion > 0 ? string.Format(MensajeDeProductoDto.ProductoAgregadoCorrectamente, productoDto.descripcion) + ". Código: " + productoDto.Codigo : MensajeDeProductoDto.ProductoNoGuardar + ". Código: " + productoDto.Codigo,
                fechaDeRegistro = DateTime.Now,
                nombreDelMetodo = nameof(AgregarProducto),
                tabla = "Producto",
                idBitacora = Guid.NewGuid(),
                identificador = productoDto.Identificador,
                usuario = productoDto.Usuario
            });
        }
    }
}
