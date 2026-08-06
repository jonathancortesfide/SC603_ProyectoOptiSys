using Softlithe.ERP.Abstracciones.Contenedores.Autenticacion;

namespace Softlithe.ERP.Api.Servicios;

public interface IJwtTokenService
{
    Task<string> GenerarTokenAsync(UsuarioSesionDto Usuario);
}
