namespace Softlithe.ERP.Abstracciones.Contenedores.Usuarios;

public static class MensajeDeUsuarioDto
{
    public const string UsuarioAgregadoCorrectamente = "El usuario fue agregado correctamente.";
    public const string UsuarioModificadoCorrectamente = "El usuario fue modificado correctamente.";
    public const string UsuarioEstadoCorrectamente = "El usuario \"{0}\" quedó en estado {1}.";
    public const string UsuarioNoGuardado = "No fue posible guardar el usuario. ";
    public const string CodigoUsuarioRequerido = "El código de usuario (id_usuario) es requerido.";

    public const string UsuarioCorreoNoEncontrado = "No se encontró un usuario con el correo indicado.";
}
