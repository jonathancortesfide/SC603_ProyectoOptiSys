using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Vendedores;

public class ParametroConsultaVendedor
{
    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
    public int Identificador { get; set; }

    /// <summary>
    /// Si está vacío se devuelven todos los vendedores del identificador; si no, filtro por coincidencia parcial.
    /// </summary>
    public string Descripcion { get; set; } = string.Empty;
}
