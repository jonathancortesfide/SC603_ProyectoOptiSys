namespace Softlithe.ERP.Abstracciones.Contenedores.Seguridad
{
    public class ModuloDto
    {
        public int IdModulo { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int IdSeccion { get; set; }
        public string NombreSeccion { get; set; } = string.Empty;
        public bool Activo { get; set; }
    }

    public class AgregarModuloDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int IdSeccion { get; set; }
        public string Usuario { get; set; } = string.Empty;
    }

    public class ModificarEstadoModuloDto
    {
        public int IdModulo { get; set; }
        public bool EsActivo { get; set; }
        public string Usuario { get; set; } = string.Empty;
    }

    public class ModuloConModeloDeValidacion : ModeloValidacion
    {
        public List<ModuloDto> Modulos { get; set; } = new();
    }
}
