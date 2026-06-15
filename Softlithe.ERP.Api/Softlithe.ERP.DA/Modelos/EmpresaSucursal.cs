using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos;

[Table("Empresa_Sucursal")]
public class EmpresaSucursal
{
    [Key]
    [Column("identificador")]
    public int Identificador { get; set; }

    [Column("no_empresa")]
    public int NoEmpresa { get; set; }

    [Column("no_sucursal")]
    public int NoSucursal { get; set; }

    public virtual Empresa Empresa { get; set; } = null!;

    public virtual Sucursal Sucursal { get; set; } = null!;

    public virtual ICollection<UsuarioEmpresaSucursal> UsuarioEmpresaSucursales { get; set; } = new List<UsuarioEmpresaSucursal>();
}
