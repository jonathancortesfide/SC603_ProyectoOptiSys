namespace Softlithe.ERP.Abstracciones.Contenedores.Vendedores;

public class RespuestaCambiarEstadoVendedorDA
{
    public VendedorDto ModeloVendedor { get; set; } = new();

    public int ResultadoRegistro { get; set; }
}
