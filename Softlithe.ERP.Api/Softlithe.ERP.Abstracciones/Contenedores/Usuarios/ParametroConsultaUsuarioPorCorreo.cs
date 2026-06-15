using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Usuarios;

public class ParametroConsultaUsuarioPorCorreo
{
    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.EmailRequerido)]
    [EmailAddress(ErrorMessage = "El formato del correo electrónico no es válido.")]
    public string Email { get; set; } = string.Empty;
}
