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
    public class ModificarProveedorBW : IModificarProveedorBW
    {
        private readonly IProveedorRepository _proveedorRepository;
        private readonly IProveedorBC _proveedorBC;
        private readonly IAgregarEventoBitacoraBW _agregarEventoBitacoraBW;
        private readonly IErrorLogger _logger;

        public ModificarProveedorBW(
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

        public async Task<ModeloValidacion> ModificarProveedor(ProveedorDto proveedorDto)
        {
            try
            {
                var validacion = await _proveedorBC.ValidarProveedorParaActualizar(proveedorDto);
                if (!validacion.EsCorrecto)
                {
                    return validacion;
                }

                int resultadoActualizacion = await _proveedorRepository.ActualizarProveedorAsync(proveedorDto);
                int respuestaBitacora = await AgregarEventoBitacoraCorrecto(proveedorDto, resultadoActualizacion);

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
                Mensaje = (resultadoActualizacion > 0 ? string.Format(MensajeDeProveedorDto.ProveedorModificadoCorrectamente, "") : MensajeDeProveedorDto.ProveedorNoGuardar) + (errorBitacora == 0 ? MensajesGeneralesDelSistemaDto.ErrorGuardarBitacora : string.Empty),
                EsCorrecto = resultadoActualizacion > 0
            };
        }

        private async Task<int> AgregarEventoBitacoraCorrecto(ProveedorDto proveedorDto, int resultadoActualizacion)
        {
            return await _agregarEventoBitacoraBW.AgregarEventoBitacora(new BitacoraDto
            {
                descripcionDelEvento = resultadoActualizacion > 0 ? string.Format(MensajeDeProveedorDto.ProveedorModificadoCorrectamente, proveedorDto.Nombre) + ". Cédula: " + proveedorDto.Cedula : MensajeDeProveedorDto.ProveedorNoGuardar + ". Cédula: " + proveedorDto.Cedula,
                fechaDeRegistro = DateTime.Now,
                nombreDelMetodo = nameof(ModificarProveedor),
                tabla = "Proveedor",
                idBitacora = Guid.NewGuid(),
                identificador = proveedorDto.Identificador,
                usuario = proveedorDto.Usuario
            });
        }
    }
}
