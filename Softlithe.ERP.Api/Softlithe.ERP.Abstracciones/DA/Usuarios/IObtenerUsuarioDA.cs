using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;

namespace Softlithe.ERP.Abstracciones.DA.Usuarios;

public interface IObtenerUsuarioDA
{
    Task<List<UsuarioDto>> ObtenerUsuarios(int identificador, string? descripcion);

    Task<UsuarioDto?> ObtenerUsuarioPorId(int idUsuario);

    Task<UsuarioDto?> ObtenerUsuarioPorCorreo(string email);

    Task<List<UsuarioDto>> ObtenerDoctores(int identificador);

    /// <summary>Usuarios que no tienen ningún registro en Usuario_Empresa_Sucursal.</summary>
    Task<List<UsuarioDto>> BuscarSinSucursal(string? busqueda);
}
