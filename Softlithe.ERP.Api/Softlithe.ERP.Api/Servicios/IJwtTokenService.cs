using Softlithe.ERP.Abstracciones.Contenedores.Autenticacion;

namespace Softlithe.ERP.Api.Servicios;

public interface IJwtTokenService
{
    string GenerarToken(UsuarioSesionDto Usuario);
}
