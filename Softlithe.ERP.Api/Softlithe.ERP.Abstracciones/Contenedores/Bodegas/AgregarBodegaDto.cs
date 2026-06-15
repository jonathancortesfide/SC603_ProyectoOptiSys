using System.ComponentModel.DataAnnotations;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;

namespace Softlithe.ERP.Abstracciones.Contenedores.Bodegas;

public class AgregarBodegaDto
{
    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoEmpresaRequerida)]
    public int NoEmpresa { get; set; }

    [Required(ErrorMessage = MensajeDeBodegaDto.DescripcionRequerida)]
    public string Descripcion { get; set; } = string.Empty;

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.DatoEsActivoRequerido)]
    public bool EsActivo { get; set; }

    [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
    public string Usuario { get; set; } = string.Empty;
}
