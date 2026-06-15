namespace Softlithe.ERP.Abstracciones.Contenedores.Enfermedades
{
    public class EnfermedadCatalogoResponseDto
    {
        public int idEnfermedad { get; set; }
        public string descripcion { get; set; } = string.Empty;
        public int noTipo { get; set; }
        public string tipoNombre { get; set; } = string.Empty;
    }
}
