using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Usuarios;

public class ParametroConsultaUsuario
{
    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
    public int Identificador { get; set; }

    /// <summary>
    /// Si está vacío se devuelven todos los usuarios del identificador; si no, filtro por coincidencia parcial en nombre.
    /// </summary>
    public string Descripcion { get; set; } = string.Empty;
}
