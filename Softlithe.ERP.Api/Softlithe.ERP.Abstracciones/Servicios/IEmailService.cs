namespace Softlithe.ERP.Abstracciones.Servicios;

public interface IEmailService
{
    Task EnviarInvitacionActivacionAsync(string destinatario, string nombreUsuario, string urlActivacion);
}
