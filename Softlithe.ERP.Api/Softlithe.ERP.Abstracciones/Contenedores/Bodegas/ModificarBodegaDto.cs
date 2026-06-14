using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Bodegas;

public class ModificarBodegaDto
{
    [Required(ErrorMessage = MensajeDeBodegaDto.CodigoBodegaRequerido)]
    public int NoBodega { get; set; }

    [Required(ErrorMessage = MensajeDeBodegaDto.DescripcionRequerida)]
    public string Descripcion { get; set; } = string.Empty;

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
    public string Usuario { get; set; } = string.Empty;
}
