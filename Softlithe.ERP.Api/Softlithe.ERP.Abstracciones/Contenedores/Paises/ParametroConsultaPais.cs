namespace Softlithe.ERP.Abstracciones.Contenedores.Paises;

/// <summary>
/// Filtro opcional por nombre. Cadena vacía devuelve todos los países.
/// </summary>
public class ParametroConsultaPais
{
    public string Nombre { get; set; } = string.Empty;
}
