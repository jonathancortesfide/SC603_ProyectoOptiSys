
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Graph.Models;
using Microsoft.Identity.Abstractions;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;

namespace Softlithe.ERP.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SeguridadController : Controller
    {
        private readonly ILogger<SeguridadController> _logger;
        private readonly IEmailSender _emailSender;
        public SeguridadController(UserManager<IdentityUser> userManager,
            SignInManager<IdentityUser> signInManager,
            ILogger<SeguridadController> logger,
            IEmailSender emailSender)
        {
            _logger = logger;
            _emailSender = emailSender;
        }
        //[HttpPost("ObtenerToken")]
        //public async Task<JsonResult> ObtenerToken()
        //{

        //}
    }
}
