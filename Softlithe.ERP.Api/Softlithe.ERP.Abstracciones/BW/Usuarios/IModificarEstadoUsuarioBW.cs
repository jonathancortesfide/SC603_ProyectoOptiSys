using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;

namespace Softlithe.ERP.Abstracciones.BW.Usuarios;

public interface IModificarEstadoUsuarioBW
{
    Task<ModeloValidacion> ModificarEstadoUsuario(ModificarEstadoUsuarioDto dto);
}
