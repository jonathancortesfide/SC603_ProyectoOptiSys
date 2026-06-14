namespace Softlithe.ERP.Abstracciones.Contenedores.Paises;

public class PaisDto
{
    public int NoPais { get; set; }
    public string Nombre { get; set; } = string.Empty;
}

public class PaisConModeloDeValidacion : ModeloValidacion
{
    public List<PaisDto> LaListaDePaises { get; set; } = new List<PaisDto>();
}
