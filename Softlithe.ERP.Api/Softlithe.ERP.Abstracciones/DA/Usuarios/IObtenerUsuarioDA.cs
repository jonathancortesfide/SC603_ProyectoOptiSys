using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;

namespace Softlithe.ERP.Abstracciones.DA.Usuarios;

public interface IObtenerUsuarioDA
{
    Task<List<UsuarioDto>> ObtenerUsuarios(int identificador, string? descripcion);

    Task<UsuarioDto?> ObtenerUsuarioPorId(int idUsuario);

    Task<UsuarioDto?> ObtenerUsuarioPorCorreo(string email);
}
