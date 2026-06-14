namespace Softlithe.ERP.Abstracciones.Contenedores.Seguridad
{
    public class RolDto
    {
        public int IdRol { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public bool Activo { get; set; }
    }

    public class AgregarRolDto
    {
        public string Nombre { get; set; } = string.Empty;
        public string? Descripcion { get; set; }
        public string Usuario { get; set; } = string.Empty;
    }

    public class ModificarEstadoRolDto
    {
        public int IdRol { get; set; }
        public bool EsActivo { get; set; }
        public string Usuario { get; set; } = string.Empty;
    }

    public class RolConModeloDeValidacion : ModeloValidacion
    {
        public List<RolDto> Roles { get; set; } = new();
    }
}
