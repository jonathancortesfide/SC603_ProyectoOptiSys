using Softlithe.ERP.Abstracciones.Contenedores.Vendedores;

namespace Softlithe.ERP.Abstracciones.DA.Vendedores;

public interface IObtenerVendedorDA
{
    Task<List<VendedorDto>> ObtenerVendedores(int identificador, string? descripcion);

    /// <summary>
    /// Primer vendedor activo con <c>id_usuario</c> coincidente y <c>identificador</c> de sucursal/contexto.
    /// </summary>
    Task<VendedorDto?> ObtenerVendedorPorUsuario(int identificador, int idUsuario);
}
