using Softlithe.ERP.Abstracciones.Contenedores.Bodegas;

namespace Softlithe.ERP.Abstracciones.DA.Bodegas;

public interface IObtenerBodegaDA
{
    Task<List<BodegaDto>> ObtenerBodegas(int noEmpresa, string? descripcion, int? idProducto);

    Task<int?> ObtenerIdentificadorPorNoBodega(int noBodega);

    Task<int?> ObtenerIdentificadorPorNoEmpresa(int noEmpresa);
}
