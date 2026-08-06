using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Softlithe.ERP.Abstracciones.Servicios;

namespace Softlithe.ERP.Api.Servicios;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, ILogger<EmailService> logger)
    {
        _config = config;
        _logger = logger;
    }

    public async Task EnviarInvitacionActivacionAsync(string destinatario, string nombreUsuario, string urlActivacion)
    {
        var seccion = _config.GetSection("EmailConfig");
        var host = seccion["Host"] ?? throw new InvalidOperationException("EmailConfig:Host no configurado.");
        var port = int.Parse(seccion["Port"] ?? "587");
        var remitente = seccion["Remitente"] ?? throw new InvalidOperationException("EmailConfig:Remitente no configurado.");
        var password = seccion["Password"] ?? throw new InvalidOperationException("EmailConfig:Password no configurado.");
        var nombreRemitente = seccion["NombreRemitente"] ?? "Elixir Sistema";

        using var client = new SmtpClient(host, port)
        {
            EnableSsl = true,
            Credentials = new NetworkCredential(remitente, password),
        };

        var mensaje = new MailMessage
        {
            From = new MailAddress(remitente, nombreRemitente),
            Subject = "Activación de tu cuenta en Elixir",
            Body = ConstruirHtml(nombreUsuario, urlActivacion),
            IsBodyHtml = true,
        };
        mensaje.To.Add(destinatario);

        await client.SendMailAsync(mensaje);
        _logger.LogInformation("Correo de activación enviado a {Email}", destinatario);
    }

    private static string ConstruirHtml(string nombre, string urlActivacion) => $"""
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Activación de cuenta</title>
        </head>
        <body style="margin:0;padding:0;background:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="580" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                  <!-- Header -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#1a73e8 0%,#0d47a1 100%);padding:36px 40px;text-align:center;">
                      <h1 style="margin:0;color:#ffffff;font-size:28px;font-weight:700;letter-spacing:-0.5px;">Elixir</h1>
                      <p style="margin:6px 0 0;color:#b3d1ff;font-size:13px;letter-spacing:1px;text-transform:uppercase;">Sistema de Gestión Óptica</p>
                    </td>
                  </tr>

                  <!-- Body -->
                  <tr>
                    <td style="padding:40px 40px 20px;">
                      <p style="margin:0 0 8px;font-size:22px;font-weight:600;color:#1a1a2e;">Hola, {WebUtility.HtmlEncode(nombre)} 👋</p>
                      <p style="margin:0 0 24px;font-size:15px;color:#555;line-height:1.6;">
                        Tu cuenta en <strong>Elixir</strong> ha sido creada. Para poder ingresar al sistema necesitás activar tu cuenta y establecer tu contraseña.
                      </p>

                      <!-- CTA Button -->
                      <table cellpadding="0" cellspacing="0" style="margin:0 auto 28px;">
                        <tr>
                          <td align="center" style="background:linear-gradient(135deg,#1a73e8 0%,#0d47a1 100%);border-radius:8px;">
                            <a href="{urlActivacion}"
                               style="display:inline-block;padding:14px 36px;color:#ffffff;text-decoration:none;font-size:15px;font-weight:600;letter-spacing:0.3px;">
                              Activar mi cuenta
                            </a>
                          </td>
                        </tr>
                      </table>

                      <p style="margin:0 0 8px;font-size:13px;color:#888;line-height:1.5;">
                        Si el botón no funciona, copiá este enlace en tu navegador:
                      </p>
                      <p style="margin:0 0 28px;font-size:12px;color:#1a73e8;word-break:break-all;">
                        {urlActivacion}
                      </p>

                      <!-- Divider -->
                      <hr style="border:none;border-top:1px solid #eef0f4;margin:0 0 24px;" />

                      <p style="margin:0;font-size:13px;color:#aaa;line-height:1.5;">
                        Este enlace expira en <strong>24 horas</strong>. Si no solicitaste esta cuenta, podés ignorar este correo.
                      </p>
                    </td>
                  </tr>

                  <!-- Footer -->
                  <tr>
                    <td style="background:#f9fafb;padding:20px 40px;border-top:1px solid #eef0f4;text-align:center;">
                      <p style="margin:0;font-size:12px;color:#bbb;">
                        © {DateTime.UtcNow.Year} Elixir &mdash; Sistema de Gestión Óptica. Todos los derechos reservados.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """;
}
