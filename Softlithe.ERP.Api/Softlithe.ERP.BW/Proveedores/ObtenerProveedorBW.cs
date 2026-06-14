using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.BW.Proveedores;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.Contenedores.Proveedores;
using Softlithe.ERP.Abstracciones.DA.Proveedores;

namespace Softlithe.ERP.BW.Proveedores
{
    public class ObtenerProveedorBW : IObtenerProveedorBW
    {
        private readonly IProveedorRepository _proveedorRepository;
        private readonly IErrorLogger _logger;

        public ObtenerProveedorBW(IProveedorRepository proveedorRepository, IErrorLogger errorLogger)
        {
            _proveedorRepository = proveedorRepository;
            _logger = errorLogger;
        }

        public async Task<ProveedorConModeloDeValidacion> ObtenerProveedores(ParametroConsultaProveedor parametroConsultaProveedor)
        {
            try
            {
                List<ProveedorDto> proveedores = await _proveedorRepository.ObtenerProveedoresAsync(
                    parametroConsultaProveedor.Identificador,
                    parametroConsultaProveedor.NoProveedor,
                    parametroConsultaProveedor.Cedula,
                    parametroConsultaProveedor.Nombre,
                    parametroConsultaProveedor.EsActivo);

                return ConstruirRespuestaExitosa(proveedores);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaExitosa(null);
            }
        }

        private ProveedorConModeloDeValidacion ConstruirRespuestaExitosa(List<ProveedorDto>? laListaDeProveedores)
        {
            return new ProveedorConModeloDeValidacion
            {
                LaListaDeProveedores = laListaDeProveedores ?? new List<ProveedorDto>(),
                Mensaje = laListaDeProveedores == null ? MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema : MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = laListaDeProveedores != null,
            };
        }
    }
}
