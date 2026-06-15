using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Proveedores;
using Softlithe.ERP.Abstracciones.BC.Proveedores;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.Proveedores;
using Softlithe.ERP.Abstracciones.DA.Proveedores;

namespace Softlithe.ERP.BW.Proveedores
{
    public class ModificarEstadoProveedorBW : IModificarEstadoProveedorBW
    {
        private readonly IProveedorRepository _proveedorRepository;
        private readonly IProveedorBC _proveedorBC;
        private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
        private readonly IErrorLogger _logger;

        public ModificarEstadoProveedorBW(
            IProveedorRepository proveedorRepository,
            IProveedorBC proveedorBC,
            IAgregarEventoBitacoraBW agregarEventoBitacoraBW,
            IErrorLogger errorLogger)
        {
            _proveedorRepository = proveedorRepository;
            _proveedorBC = proveedorBC;
            _agregarEventoBitacoraBW = agregarEventoBitacoraBW;
            _logger = errorLogger;
        }

        public async Task<ModeloValidacion> ModificaEstadoProveedor(ProveedorInActivaDto proveedorInActivaDto)
        {
            try
            {
                var validacion = await _proveedorBC.ValidarProveedorParaCambiarEstado(proveedorInActivaDto);
                if (!validacion.EsCorrecto)
                {
                    return validacion;
                }

                int resultadoCambioEstado = await _proveedorRepository.ModificaEstadoProveedorAsync(proveedorInActivaDto);
                int respuestaBitacora = await AgregarEventoBitacoraCorrecto(proveedorInActivaDto, resultadoCambioEstado);

                return ConstruirRespuestaExitosa(resultadoCambioEstado, proveedorInActivaDto.EsActivo, respuestaBitacora);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaExitosa(0, false, 1);
            }
        }

        private ModeloValidacion ConstruirRespuestaExitosa(int resultadoCambioEstado, bool estadoProveedornuevo, int errorBitacora)
        {
            var estadoTexto = resultadoCambioEstado > 0 ? (estadoProveedornuevo == true ? "Activo" : "Inactivo") : "Desconocido";
            return new ModeloValidacion
            {
                Mensaje = (resultadoCambioEstado > 0 ? string.Format(MensajeDeProveedorDto.ProveedorModificaEstadoCorrectamente, "", estadoTexto) : MensajeDeProveedorDto.ProveedorNoGuardar) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
                EsCorrecto = resultadoCambioEstado > 0
            };
        }

        private async Task<int> AgregarEventoBitacoraCorrecto(ProveedorInActivaDto proveedorInActivaDto, int resultadoCambioEstado)
        {
            var estadoTexto = proveedorInActivaDto.EsActivo ? "Activo" : "Inactivo";
            return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
            {
                descripcionDelEvento = resultadoCambioEstado > 0 ? string.Format(MensajeDeProveedorDto.ProveedorModificaEstadoCorrectamente, "No. " + proveedorInActivaDto.NoProveedor, estadoTexto) : MensajeDeProveedorDto.ProveedorNoGuardar + ". No. Proveedor: " + proveedorInActivaDto.NoProveedor,
                fechaDeRegistro = DateTime.Now,
                nombreDelMetodo = nameof(ModificaEstadoProveedor),
                tabla = "Proveedor",
                idBitacora = Guid.NewGuid(),
                identificador = proveedorInActivaDto.Identificador,
                usuario = proveedorInActivaDto.Usuario
            });
        }
    }
}
