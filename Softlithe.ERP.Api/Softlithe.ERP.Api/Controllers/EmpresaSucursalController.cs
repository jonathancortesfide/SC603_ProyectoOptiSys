using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.BW.EmpresaSucursal;
using Softlithe.ERP.Abstracciones.Contenedores.EmpresaSucursal;

namespace Softlithe.ERP.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EmpresaSucursalController : ControllerBase
    {
        private readonly IObtenerEmpresaSucursalBW _obtenerEmpresaSucursalBW;

        public EmpresaSucursalController(IObtenerEmpresaSucursalBW obtenerEmpresaSucursalBW)
        {
            _obtenerEmpresaSucursalBW = obtenerEmpresaSucursalBW;
        }

        /// <summary>
        /// Obtiene las empresas asociadas a un usuario mediante su correo electrónico.
        /// </summary>
        [HttpPost("ObtenerEmpresasPorUsuario")]
        public async Task<EmpresaConModeloDeValidacion> ObtenerEmpresasPorUsuario(ParametroConsultaUsuarioPorEmail parametro)
        {
            EmpresaConModeloDeValidacion resultado = await _obtenerEmpresaSucursalBW.ObtenerEmpresasPorEmailUsuario(parametro);
            return resultado;
        }

        /// <summary>
        /// Obtiene las sucursales asociadas a un usuario mediante su correo electrónico.
        /// </summary>
        [HttpPost("ObtenerSucursalesPorUsuario")]
        public async Task<SucursalConModeloDeValidacion> ObtenerSucursalesPorUsuario(ParametroConsultaSucursalPorEmpresaEmail parametro)
        {
            SucursalConModeloDeValidacion resultado = await _obtenerEmpresaSucursalBW.ObtenerSucursalesPorEmailUsuario(parametro);
            return resultado;
        }

        /// <summary>
        /// Obtiene los parámetros de facturación asociados a la sucursal (empresa-sucursal) para el identificador indicado.
        /// </summary>
        [HttpGet("ObtenerParametroFacturacionSucursal")]
        public async Task<ParametroFacturacionSucursalConModeloDeValidacion> ObtenerParametroFacturacionSucursal([FromQuery] int identificador)
        {
            return await _obtenerEmpresaSucursalBW.ObtenerParametroFacturacionSucursal(identificador);
        }
    }
}
