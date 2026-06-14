namespace Softlithe.ERP.Abstracciones.Contenedores.Seguridad
{
    public class SeccionDto
    {
        public int IdSeccion { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public bool Activo { get; set; }
    }

    public class AgregarSeccionDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Usuario { get; set; } = string.Empty;
    }

    public class ModificarEstadoSeccionDto
    {
        public int IdSeccion { get; set; }
        public bool EsActivo { get; set; }
        public string Usuario { get; set; } = string.Empty;
    }

    public class SeccionConModeloDeValidacion : ModeloValidacion
    {
        public List<SeccionDto> Secciones { get; set; } = new();
    }
}
