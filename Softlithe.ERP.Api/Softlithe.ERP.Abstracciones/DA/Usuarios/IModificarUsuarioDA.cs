using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;

namespace Softlithe.ERP.Abstracciones.DA.Usuarios;

public interface IModificarUsuarioDA
{
    Task<int> ModificarUsuario(ModificarUsuarioDto dto);
}
