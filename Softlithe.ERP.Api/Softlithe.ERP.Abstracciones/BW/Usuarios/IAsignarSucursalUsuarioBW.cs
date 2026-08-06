using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;

namespace Softlithe.ERP.Abstracciones.BW.Usuarios;

public interface IAsignarSucursalUsuarioBW
{
    Task<ModeloValidacion> AsignarSucursal(AsignarSucursalUsuarioDto dto);
}
