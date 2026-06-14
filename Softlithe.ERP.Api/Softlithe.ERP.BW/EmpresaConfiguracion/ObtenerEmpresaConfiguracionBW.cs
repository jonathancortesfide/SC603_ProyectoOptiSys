using Softlithe.ERP.Abstracciones.BW.EmpresaConfiguracion;
using Softlithe.ERP.Abstracciones.BW.Generales.ManejoDeErrores;
using Softlithe.ERP.Abstracciones.Contenedores.EmpresaConfiguracion;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.EmpresaConfiguracion;

namespace Softlithe.ERP.BW.EmpresaConfiguracion
{
    public class ObtenerEmpresaConfiguracionBW : IObtenerEmpresaConfiguracionBW
    {
        private readonly IObtenerEmpresaConfiguracionDA _obtenerEmpresaConfiguracionDA;
        private readonly IErrorLogger _logger;

        public ObtenerEmpresaConfiguracionBW(IObtenerEmpresaConfiguracionDA obtenerEmpresaConfiguracionDA, IErrorLogger errorLogger)
        {
            _obtenerEmpresaConfiguracionDA = obtenerEmpresaConfiguracionDA;
            _logger = errorLogger;
        }

        public async Task<ActividadEcoEmpresaConModeloDeValidacion> ObtenerActividadEconomicaEmpresa(int identificador)
        {
            if (identificador <= 0)
            {
                return new ActividadEcoEmpresaConModeloDeValidacion
                {
                    ListaActividadesEconomicas = new List<ActividadEconomicaEmpresaDto>(),
                    Mensaje = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido,
                    EsCorrecto = false,
                };
            }

            try
            {
                List<ActividadEconomicaEmpresaDto> lista = await _obtenerEmpresaConfiguracionDA.ObtenerActividadesEconomicasPorIdentificador(identificador);
                return new ActividadEcoEmpresaConModeloDeValidacion
                {
                    ListaActividadesEconomicas = lista,
                    Mensaje = MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                    EsCorrecto = true,
                };
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return new ActividadEcoEmpresaConModeloDeValidacion
                {
                    ListaActividadesEconomicas = new List<ActividadEconomicaEmpresaDto>(),
                    Mensaje = MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema,
                    EsCorrecto = false,
                };
            }
        }

        public async Task<ParametroFactConModeloDeValidacion> ObtenerParametroFacturacionEmpresa(int identificador)
        {
            if (identificador <= 0)
            {
                return new ParametroFactConModeloDeValidacion
                {
                    ParametroFacturacionEmpresa = null,
                    Mensaje = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido,
                    EsCorrecto = false,
                };
            }

            try
            {
                ParametroFacturacionEmpresaDto? parametro = await _obtenerEmpresaConfiguracionDA.ObtenerParametroFacturacionPorIdentificador(identificador);
                return new ParametroFactConModeloDeValidacion
                {
                    ParametroFacturacionEmpresa = parametro,
                    Mensaje = parametro == null
                        ? "No se encontraron parámetros de facturación para el identificador especificado."
                        : MensajesGeneralesDelSistemaDto.DatosObtenidosDeManeraCorrecta,
                    EsCorrecto = true,
                };
            }
            catch (Exception ex)
            {
                await _logger.RegistrarEventoError(ex);
                return new ParametroFactConModeloDeValidacion
                {
                    ParametroFacturacionEmpresa = null,
                    Mensaje = MensajesGeneralesDelSistemaDto.OcurrioUnErrorEnElSistema,
                    EsCorrecto = false,
                };
            }
        }
    }
}
