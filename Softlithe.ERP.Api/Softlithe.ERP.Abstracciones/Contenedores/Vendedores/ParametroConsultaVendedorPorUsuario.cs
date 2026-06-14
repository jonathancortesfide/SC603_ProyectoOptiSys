using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Vendedores;

/// <summary>
/// Vendedor por usuario logueado (<c>id_usuario</c> en tabla <c>Vendedor</c>).
/// </summary>
public class ParametroConsultaVendedorPorUsuario
{
    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
    public int Identificador { get; set; }

    [Required(ErrorMessage = "El id de usuario es requerido.")]
    [Range(1, int.MaxValue, ErrorMessage = "El id de usuario debe ser mayor que cero.")]
    public int IdUsuario { get; set; }
}
