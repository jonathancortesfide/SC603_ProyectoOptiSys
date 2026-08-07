namespace Softlithe.ERP.Abstracciones.Contenedores.Pacientes;

public class TipoIdentificacionDto
{
    public int IdTipoIdentificacion { get; set; }
    public string Codigo { get; set; } = string.Empty;
    public string Nombre { get; set; } = string.Empty;
    public bool Activo { get; set; }
}