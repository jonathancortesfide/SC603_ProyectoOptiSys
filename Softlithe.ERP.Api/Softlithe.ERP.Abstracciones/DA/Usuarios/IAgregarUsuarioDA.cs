using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;

namespace Softlithe.ERP.Abstracciones.DA.Usuarios;

public interface IAgregarUsuarioDA
{
    Task<int> AgregarUsuario(AgregarUsuarioDto dto);
}
