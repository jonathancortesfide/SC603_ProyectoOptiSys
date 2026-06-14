using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Bodegas;

public class ModificarEstadoBodegaDto
{
    [Required(ErrorMessage = MensajeDeBodegaDto.CodigoBodegaRequerido)]
    public int NoBodega { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.DatoEsActivoRequerido)]
    public bool EsActivo { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
    public string Usuario { get; set; } = string.Empty;
}
