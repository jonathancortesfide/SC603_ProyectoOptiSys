namespace Softlithe.ERP.Abstracciones.Contenedores.Seguridad
{
    public class RolPermisoDto
    {
        public int IdRolPermiso { get; set; }
        public int IdRol { get; set; }
        public string NombreRol { get; set; } = string.Empty;
        public int IdPermiso { get; set; }
        public string NombrePermiso { get; set; } = string.Empty;
        public string CodigoPermiso { get; set; } = string.Empty;
        public bool Activo { get; set; }
    }

    public class AsignarPermisoARolDto
    {
        public int IdRol { get; set; }
        public int IdPermiso { get; set; }
        public string Usuario { get; set; } = string.Empty;
    }

    public class ModificarEstadoRolPermisoDto
    {
        public int IdRolPermiso { get; set; }
        public bool EsActivo { get; set; }
        public string Usuario { get; set; } = string.Empty;
    }

    public class RolPermisoConModeloDeValidacion : ModeloValidacion
    {
        public List<RolPermisoDto> Permisos { get; set; } = new();
    }
}
