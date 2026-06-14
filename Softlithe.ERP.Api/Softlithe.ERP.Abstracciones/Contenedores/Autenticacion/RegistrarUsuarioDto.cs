using System.Text.Json.Serialization;

namespace Softlithe.ERP.Abstracciones.Contenedores.Autenticacion;

public class RegistrarUsuarioDto
{
    public string Email { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public int Identificador { get; set; }
}

public class RegistrarUsuarioResponseDto
{
    [JsonPropertyName("accessToken")]
    public string AccessToken { get; set; } = string.Empty;
    public UsuarioSesionDto User { get; set; } = new();
}
