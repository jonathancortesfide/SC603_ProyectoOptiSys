using Softlithe.ERP.Abstracciones.Contenedores.Autenticacion;

namespace Softlithe.ERP.Abstracciones.BW.Autenticacion;

public interface IAutenticacionBW
{
    Task<UsuarioSesionDto?> ValidarCredencialesAsync(string Email, string Password);
    Task<UsuarioSesionDto?> RegistrarUsuarioAsync(RegistrarUsuarioDto Request);
}
