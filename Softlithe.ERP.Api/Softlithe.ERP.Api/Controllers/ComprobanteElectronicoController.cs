using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Softlithe.FE.Abstracciones.API;
using Softlithe.FE.Abstracciones.BW.ComprobanteElectronico;
using Softlithe.FE.Abstracciones.Contenedores.ComprobanteElectronico;

namespace Softlithe.FE.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ComprobanteElectronicoController : Controller, IComprobanteElectronicoController
    {
        readonly IConsultaComprobanteElectronicoBW _consultaComprobanteElectronicoBW;
        public ComprobanteElectronicoController(IConsultaComprobanteElectronicoBW consultaComprobanteElectronicoBW)
        {
            _consultaComprobanteElectronicoBW = consultaComprobanteElectronicoBW;
        }
        [HttpPost]
        [AllowAnonymous]
        [Route("ConsultarEstadoComprobanteElectronico")]
        public async Task<ModeloRespuestaConsultaComprobante> ConsultarEstadoComprobanteElectronico(int identificador, string? codigoClave)
        {
            return await _consultaComprobanteElectronicoBW.ConsultarEstadoComprobanteElectronico(identificador, codigoClave);
        }
    }
}
