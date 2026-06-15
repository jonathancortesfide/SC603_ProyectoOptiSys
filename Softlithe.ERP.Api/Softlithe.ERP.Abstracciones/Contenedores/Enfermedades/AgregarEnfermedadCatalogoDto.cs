namespace Softlithe.ERP.Abstracciones.Contenedores.Enfermedades
{
    public class AgregarEnfermedadCatalogoDto
    {
        public string descripcion { get; set; } = string.Empty;
        public int noTipo { get; set; }
        public string usuario { get; set; } = string.Empty;
    }
}
