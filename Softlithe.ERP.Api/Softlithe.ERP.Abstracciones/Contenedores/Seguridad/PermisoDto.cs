namespace Softlithe.ERP.Abstracciones.Contenedores.Seguridad
{
    public class PermisoDto
    {
        public int IdPermiso { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string Codigo { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int IdModulo { get; set; }
        public string NombreModulo { get; set; } = string.Empty;
        public bool Activo { get; set; }
    }

    public class AgregarPermisoDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string Codigo { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public int IdModulo { get; set; }
        public string Usuario { get; set; } = string.Empty;
    }

    public class ModificarEstadoPermisoDto
    {
        public int IdPermiso { get; set; }
        public bool EsActivo { get; set; }
        public string Usuario { get; set; } = string.Empty;
    }

    public class PermisoConModeloDeValidacion : ModeloValidacion
    {
        public List<PermisoDto> Permisos { get; set; } = new();
    }
}
