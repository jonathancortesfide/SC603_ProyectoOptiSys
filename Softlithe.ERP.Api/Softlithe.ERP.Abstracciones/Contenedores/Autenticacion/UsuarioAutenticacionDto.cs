namespace Softlithe.ERP.Abstracciones.Contenedores.Autenticacion;

/// <summary>
/// DTO interno DA → BW. Contiene PasswordHash. No exponer en respuestas de API.
/// </summary>
public class UsuarioParaLoginDto
{
    public int IdUsuario { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public bool Activo { get; set; }
    public int Identificador { get; set; }
}

/// <summary>
/// DTO interno BW → DA para insertar usuario con contraseña ya hasheada.
/// </summary>
public class RegistrarUsuarioInternoDto
{
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public int Identificador { get; set; }
}
