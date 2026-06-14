namespace Softlithe.ERP.Abstracciones.Contenedores.Autenticacion;

public class MiCuentaResponseDto
{
    public UsuarioSesionDto User { get; set; } = new();
}

public class UsuarioSesionDto
{
    public string Id { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string Role { get; set; } = "user";
}
