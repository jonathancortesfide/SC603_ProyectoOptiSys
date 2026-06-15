using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;

namespace Softlithe.ERP.Abstracciones.BW.Usuarios;

public interface IObtenerUsuarioBW
{
    Task<UsuarioConModeloDeValidacion> ObtenerUsuario(ParametroConsultaUsuario parametro);

    Task<ModeloValidacionConDatos<UsuarioDto?>> ObtenerUsuarioPorId(ParametroConsultaUsuarioPorId parametro);

    Task<ModeloValidacionConDatos<UsuarioDto?>> ObtenerUsuarioPorCorreo(ParametroConsultaUsuarioPorCorreo parametro);

    Task<ModeloValidacionConDatos<List<UsuarioDto>>> ObtenerDoctores(int identificador);
}
