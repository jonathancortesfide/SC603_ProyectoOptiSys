using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Proveedores;

namespace Softlithe.ERP.Abstracciones.BC.Proveedores
{
    public interface IProveedorBC
    {
        Task<ModeloValidacion> ValidarProveedorParaInsertar(ProveedorDto proveedorDto);
        Task<ModeloValidacion> ValidarProveedorParaActualizar(ProveedorDto proveedorDto);
        Task<ModeloValidacion> ValidarProveedorParaCambiarEstado(ProveedorInActivaDto proveedorInActivaDto);
    }
}
