using System.Linq;
using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.EmpresaConfiguracion;
using Softlithe.ERP.Abstracciones.Contenedores.EmpresaConfiguracion;

namespace Softlithe.ERP.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpresaConfiguracionController : ControllerBase
    {
        private readonly IObtenerEmpresaConfiguracionBW _obtenerEmpresaConfiguracionBW;

        public EmpresaConfiguracionController(IObtenerEmpresaConfiguracionBW obtenerEmpresaConfiguracionBW)
        {
            _obtenerEmpresaConfiguracionBW = obtenerEmpresaConfiguracionBW;
        }

        /// <summary>
        /// Obtiene la lista de actividades económicas asociadas al identificador empresa-sucursal.
        /// Solo expone filas activas (Activo = true).
        /// </summary>
        [HttpGet("ObtenerActividadEconomicaEmpresa")]
        public async Task<ActividadEcoEmpresaConModeloDeValidacion> ObtenerActividadEconomicaEmpresa([FromQuery] int identificador)
        {
            ActividadEcoEmpresaConModeloDeValidacion resultado = await _obtenerEmpresaConfiguracionBW.ObtenerActividadEconomicaEmpresa(identificador);
            if (resultado.ListaActividadesEconomicas != null)
            {
                resultado.ListaActividadesEconomicas = resultado.ListaActividadesEconomicas.Where(a => a.Activo).ToList();
            }

            return resultado;
        }

        /// <summary>
        /// Obtiene los parámetros de facturación electrónica de la empresa para el identificador indicado.
        /// </summary>
        [HttpGet("ObtenerParametroFacturacionEmpresa")]
        public async Task<ParametroFactConModeloDeValidacion> ObtenerParametroFacturacionEmpresa([FromQuery] int identificador)
        {
            return await _obtenerEmpresaConfiguracionBW.ObtenerParametroFacturacionEmpresa(identificador);
        }
    }
}
