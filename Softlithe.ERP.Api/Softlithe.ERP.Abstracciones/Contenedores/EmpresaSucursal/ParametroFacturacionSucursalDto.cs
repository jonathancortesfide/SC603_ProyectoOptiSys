namespace Softlithe.ERP.Abstracciones.Contenedores.EmpresaSucursal;

public class ParametroFacturacionSucursalDto
{
    public int NoParametroFacturacionSucursal { get; set; }
    public int Identificador { get; set; }
    public string? CodigoEstablecimiento { get; set; }
    public string? CodigoTerminal { get; set; }
    public string? CodigoProvincia { get; set; }
    public string? CodigoCanton { get; set; }
    public string? CodigoDistrito { get; set; }
    public string? CodigoBarrio { get; set; }
    public string? OtrasSenas { get; set; }
    public int? NoBodega { get; set; }
    public string? NombreBodega { get; set; }
}
