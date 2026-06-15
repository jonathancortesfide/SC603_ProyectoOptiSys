using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using System.ComponentModel.DataAnnotations;

namespace Softlithe.ERP.Abstracciones.Contenedores.Productos
{
    /// <summary>Cambio de estado por identificador de producto único (no requiere número de empresa).</summary>
    public class ProductoInActivaDto
    {
        [Required(ErrorMessage = MensajeDeProductoDto.CodigoProductoRequerido)]
        public int IdProducto { get; set; }

        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
        public string Usuario { get; set; } = string.Empty;

        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.DatoEsActivoRequerido)]
        public bool EsActivo { get; set; }

        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
        public int Identificador { get; set; }
    }
}
