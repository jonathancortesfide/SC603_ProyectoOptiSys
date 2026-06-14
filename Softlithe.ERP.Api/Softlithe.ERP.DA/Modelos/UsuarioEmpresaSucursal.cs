using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("Usuario_Empresa_Sucursal")]
public class UsuarioEmpresaSucursal
{
    [Column("id_usuario")]
    public int IdUsuario { get; set; }

    [Column("identificador")]
    public int Identificador { get; set; }

    public virtual Usuario Usuario { get; set; } = null!;

    public virtual EmpresaSucursal EmpresaSucursal { get; set; } = null!;
}
