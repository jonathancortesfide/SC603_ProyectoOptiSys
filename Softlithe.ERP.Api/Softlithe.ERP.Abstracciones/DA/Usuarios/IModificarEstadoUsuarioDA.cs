using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;

namespace Softlithe.ERP.Abstracciones.DA.Usuarios;

public interface IModificarEstadoUsuarioDA
{
    Task<RespuestaCambiarEstadoUsuarioDA> ModificarEstadoUsuario(ModificarEstadoUsuarioDto dto);
}
