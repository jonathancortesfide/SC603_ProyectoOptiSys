using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using System.ComponentModel.DataAnnotations;

namespace Softlithe.ERP.Abstracciones.Contenedores.Proveedores
{
    public class ProveedorInActivaDto
    {
        [Required(ErrorMessage = MensajeDeProveedorDto.CodigoProveedorRequerido)]
        public int NoProveedor { get; set; }

        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
        public string Usuario { get; set; } = string.Empty;

        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.DatoEsActivoRequerido)]
        public bool EsActivo { get; set; }

        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
        public int Identificador { get; set; }
    }
}
