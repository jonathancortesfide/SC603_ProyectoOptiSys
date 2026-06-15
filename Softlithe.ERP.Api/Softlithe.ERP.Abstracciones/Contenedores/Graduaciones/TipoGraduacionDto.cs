namespace Softlithe.ERP.Abstracciones.Contenedores.Graduaciones
{
    public class TipoGraduacionDto
    {
        public int IdTipoGraduacion { get; set; }
        public string? NombreTipoGraduacion { get; set; }

        public List<GraduacionDto> Graduaciones { get; set; } = new();
    }
}