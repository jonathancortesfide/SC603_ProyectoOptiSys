using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Proveedores;

namespace Softlithe.ERP.Abstracciones.BW.Proveedores
{
    public interface IModificarEstadoProveedorBW
    {
        Task<ModeloValidacion> ModificaEstadoProveedor(ProveedorInActivaDto proveedorInActivaDto);
    }
}
