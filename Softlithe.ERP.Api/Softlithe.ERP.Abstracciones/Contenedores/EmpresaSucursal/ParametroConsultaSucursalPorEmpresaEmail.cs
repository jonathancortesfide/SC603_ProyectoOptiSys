using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using System.ComponentModel.DataAnnotations;

namespace Softlithe.ERP.Abstracciones.Contenedores.EmpresaSucursal
{
    public class ParametroConsultaSucursalPorEmpresaEmail
    {
        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.EmailRequerido)]
        public string Email { get; set; } = string.Empty;
        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoEmpresaRequerida)]
        public int NoEmpresa { get; set; }
    }
}
