using Softlithe.ERP.Abstracciones.Contenedores.Proveedores;

namespace Softlithe.ERP.Abstracciones.BW.Proveedores
{
    public interface IObtenerProveedorBW
    {
        Task<ProveedorConModeloDeValidacion> ObtenerProveedores(ParametroConsultaProveedor parametroConsultaProveedor);
        Task<ProveedorConModeloDeValidacion> ObtenerProveedoresPorIdentificador(int identificador);

    }
}
