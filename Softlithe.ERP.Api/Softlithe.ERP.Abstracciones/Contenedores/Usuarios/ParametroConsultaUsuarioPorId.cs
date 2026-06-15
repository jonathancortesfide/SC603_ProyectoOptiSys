using System.ComponentModel.DataAnnotations;

namespace Softlithe.ERP.Abstracciones.Contenedores.Usuarios;

public class ParametroConsultaUsuarioPorId
{
    [Required(ErrorMessage = MensajeDeUsuarioDto.CodigoUsuarioRequerido)]
    public int IdUsuario { get; set; }
}
