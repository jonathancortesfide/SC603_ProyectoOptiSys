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
    public class ModificarEstadoProductoBW : IModificarEstadoProductoBW
    {
        private readonly IProductoRepository _productoRepository;
        private readonly IProductoBC _productoBC;
        private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
        private readonly IErrorLogger _logger;

        public ModificarEstadoProductoBW(
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

        public async Task<ModeloValidacion> ModificarEstadoProducto(ProductoInActivaDto productoInActivaDto)
        {
            try
            {
                var validacion = await _productoBC.ValidarProductoParaCambiarEstado(productoInActivaDto);
                if (!validacion.EsCorrecto)
                {
                    return validacion;
                }

                int resultadoCambioEstado = await _productoRepository.ModificaEstadoProductoAsync(productoInActivaDto);
                int respuestaBitacora = await AgregarEventoBitacoraCorrecto(productoInActivaDto, resultadoCambioEstado);

                return ConstruirRespuestaExitosa(resultadoCambioEstado, productoInActivaDto.IdProducto, productoInActivaDto.EsActivo, respuestaBitacora);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaExitosa(0, 0, false, 1);
            }
        }

        private ModeloValidacion ConstruirRespuestaExitosa(int resultadoCambioEstado, int idProducto, bool estadoProductoNuevo, int errorBitacora)
        {
            var estadoTexto = resultadoCambioEstado > 0 ? (estadoProductoNuevo ? "Activo" : "Inactivo") : "Desconocido";
            return new ModeloValidacion
            {
                Mensaje = (resultadoCambioEstado > 0 ? string.Format(MensajeDeProductoDto.ProductoModificaEstadoCorrectamente, "No. " + idProducto, estadoTexto) : MensajeDeProductoDto.ProductoNoGuardar) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
                EsCorrecto = resultadoCambioEstado > 0
            };
        }

        private async Task<int> AgregarEventoBitacoraCorrecto(ProductoInActivaDto productoInActivaDto, int resultadoCambioEstado)
        {
            var estadoTexto = productoInActivaDto.EsActivo ? "Activo" : "Inactivo";
            return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
            {
                descripcionDelEvento = resultadoCambioEstado > 0 ? string.Format(MensajeDeProductoDto.ProductoModificaEstadoCorrectamente, "Id. " + productoInActivaDto.IdProducto, estadoTexto) : MensajeDeProductoDto.ProductoNoGuardar + ". Id producto: " + productoInActivaDto.IdProducto,
                fechaDeRegistro = DateTime.Now,
                nombreDelMetodo = nameof(ModificarEstadoProducto),
                tabla = "Producto",
                idBitacora = Guid.NewGuid(),
                identificador = productoInActivaDto.Identificador,
                usuario = productoInActivaDto.Usuario
            });
        }
    }
}
