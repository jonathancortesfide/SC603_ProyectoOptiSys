using Softlithe.ERP.Abstracciones.BW.EmpresaSucursal;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.Contenedores.EmpresaSucursal;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.EmpresaSucursal;

namespace Softlithe.ERP.BW.EmpresaSucursal
{
    public class ObtenerEmpresaSucursalBW : IObtenerEmpresaSucursalBW
    {
        private readonly IObtenerEmpresaSucursalDA _obtenerEmpresaSucursalDA;
        private readonly IErrorLogger _logger;

        public ObtenerEmpresaSucursalBW(IObtenerEmpresaSucursalDA obtenerEmpresaSucursalDA, IErrorLogger errorLogger)
        {
            _obtenerEmpresaSucursalDA = obtenerEmpresaSucursalDA;
            _logger = errorLogger;
        }

        public async Task<EmpresaConModeloDeValidacion> ObtenerEmpresasPorEmailUsuario(ParametroConsultaUsuarioPorEmail parametro)
        {
            try
            {
                List<EmpresaDto> lista = await _obtenerEmpresaSucursalDA.ObtenerEmpresasPorEmailUsuario(parametro.Email);
                return ConstruirRespuestaEmpresasExitosa(lista);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaEmpresasExitosa(null);
            }
        }

        public async Task<SucursalConModeloDeValidacion> ObtenerSucursalesPorEmailUsuario(ParametroConsultaSucursalPorEmpresaEmail parametro)
        {
            try
            {
                List<SucursalDto> lista = await _obtenerEmpresaSucursalDA.ObtenerSucursalesPorEmailUsuario(parametro.Email, parametro.NoEmpresa);
                return ConstruirRespuestaSucursalesExitosa(lista);
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return ConstruirRespuestaSucursalesExitosa(null);
            }
        }

        public async Task<ParametroFacturacionSucursalConModeloDeValidacion> ObtenerParametroFacturacionSucursal(int identificador)
        {
            if (identificador <= 0)
            {
                return new ParametroFacturacionSucursalConModeloDeValidacion
                {
                    ParametroFacturacionSucursal = null,
                    Mensaje = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido,
                    EsCorrecto = false,
                };
            }

            try
            {
                ParametroFacturacionSucursalDto? parametro = await _obtenerEmpresaSucursalDA.ObtenerParametroFacturacionSucursalPorIdentificador(identificador);
                return new ParametroFacturacionSucursalConModeloDeValidacion
                {
                    ParametroFacturacionSucursal = parametro,
                    Mensaje = parametro == null
                        ? "No se encontraron parámetros de facturación para el identificador especificado."
                        : MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                    EsCorrecto = true,
                };
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return new ParametroFacturacionSucursalConModeloDeValidacion
                {
                    ParametroFacturacionSucursal = null,
                    Mensaje = MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema,
                    EsCorrecto = false,
                };
            }
        }

        private static EmpresaConModeloDeValidacion ConstruirRespuestaEmpresasExitosa(List<EmpresaDto>? lista)
        {
            return new EmpresaConModeloDeValidacion
            {
                LaListaDeEmpresas = lista ?? new List<EmpresaDto>(),
                Mensaje = lista == null ? MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema : MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = lista != null,
            };
        }

        private static SucursalConModeloDeValidacion ConstruirRespuestaSucursalesExitosa(List<SucursalDto>? lista)
        {
            return new SucursalConModeloDeValidacion
            {
                LaListaDeSucursales = lista ?? new List<SucursalDto>(),
                Mensaje = lista == null ? MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema : MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                EsCorrecto = lista != null,
            };
        }
    }
}
