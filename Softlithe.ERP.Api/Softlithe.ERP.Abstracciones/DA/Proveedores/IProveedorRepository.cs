using Softlithe.ERP.Abstracciones.Contenedores.Proveedores;

namespace Softlithe.ERP.Abstracciones.DA.Proveedores
{
    public interface IProveedorRepository
    {
        Task<List<ProveedorDto>> ObtenerProveedoresAsync(
            int identificador,
            int? noProveedor,
            string cedula,
            string nombre,
            bool? esActivo);

        Task<int> InsertarProveedorAsync(ProveedorDto proveedorDto);

        Task<int> ActualizarProveedorAsync(ProveedorDto proveedorDto);

        Task<int> ModificaEstadoProveedorAsync(ProveedorInActivaDto proveedorInActivaDto);
    }
}
