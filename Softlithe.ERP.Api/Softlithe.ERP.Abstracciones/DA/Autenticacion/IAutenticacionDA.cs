using Softlithe.ERP.Abstracciones.Contenedores.Autenticacion;

namespace Softlithe.ERP.Abstracciones.DA.Autenticacion;

public interface IAutenticacionDA
{
    Task<UsuarioParaLoginDto?> ObtenerUsuarioParaLoginAsync(string Email);
    Task<UsuarioParaLoginDto?> RegistrarUsuarioAsync(RegistrarUsuarioInternoDto Request);
}
