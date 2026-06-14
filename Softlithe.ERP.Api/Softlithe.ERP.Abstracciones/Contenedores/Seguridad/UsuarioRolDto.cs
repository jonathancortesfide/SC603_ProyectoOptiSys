namespace Softlithe.ERP.Abstracciones.Contenedores.Seguridad
{
    public class UsuarioRolDto
    {
        public int IdUsuarioRol { get; set; }
        public int IdUsuario { get; set; }
        public string NombreUsuario { get; set; } = string.Empty;
        public int IdRol { get; set; }
        public string NombreRol { get; set; } = string.Empty;
        public bool Activo { get; set; }
    }

    public class AsignarRolAUsuarioDto
    {
        public int IdUsuario { get; set; }
        public int IdRol { get; set; }
        public string Usuario { get; set; } = string.Empty;
    }

    public class ModificarEstadoUsuarioRolDto
    {
        public int IdUsuarioRol { get; set; }
        public bool EsActivo { get; set; }
        public string Usuario { get; set; } = string.Empty;
    }

    public class UsuarioRolConModeloDeValidacion : ModeloValidacion
    {
        public List<UsuarioRolDto> Roles { get; set; } = new();
    }

    /// <summary>
    /// Permiso efectivo que tiene un usuario a través de sus roles activos.
    /// </summary>
    public class PermisoEfectivoDto
    {
        public int IdPermiso { get; set; }
        public string NombrePermiso { get; set; } = string.Empty;
        public string CodigoPermiso { get; set; } = string.Empty;
        public string? DescripcionPermiso { get; set; }
        public int IdModulo { get; set; }
        public string NombreModulo { get; set; } = string.Empty;
        public int IdSeccion { get; set; }
        public string NombreSeccion { get; set; } = string.Empty;
        public int IdRol { get; set; }
        public string NombreRol { get; set; } = string.Empty;
    }

    public class PermisosEfectivosConModeloDeValidacion : ModeloValidacion
    {
        public List<PermisoEfectivoDto> Permisos { get; set; } = new();
    }
}

