using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Proveedores;

namespace Softlithe.ERP.Abstracciones.BW.Proveedores
{
    public interface IModificarProveedorBW
    {
        Task<ModeloValidacion> ModificarProveedor(ProveedorDto proveedorDto);
    }
}
