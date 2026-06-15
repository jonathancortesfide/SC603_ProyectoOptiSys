using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;

namespace Softlithe.ERP.Abstracciones.BW.Usuarios;

public interface IAgregarUsuarioBW
{
    Task<ModeloValidacion> AgregarUsuario(AgregarUsuarioDto dto);
}
