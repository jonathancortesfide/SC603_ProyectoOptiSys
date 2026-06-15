using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Bodegas;

public class ParametroConsultaBodega
{
    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoEmpresaRequerida)]
    public int NoEmpresa { get; set; }

    public string Descripcion { get; set; } = string.Empty;

    /// <summary>
    /// Si se envía, cada bodega incluye la existencia del producto en <see cref="ExistenciaBodega"/> (LEFT JOIN).
    /// </summary>
    public int? IdProducto { get; set; }
}
