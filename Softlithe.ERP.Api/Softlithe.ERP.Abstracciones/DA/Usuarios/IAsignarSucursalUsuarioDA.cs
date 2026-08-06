using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Usuarios;

namespace Softlithe.ERP.Abstracciones.DA.Usuarios;

public interface IAsignarSucursalUsuarioDA
{
    Task<ModeloValidacion> AsignarSucursal(AsignarSucursalUsuarioDto dto);
}
