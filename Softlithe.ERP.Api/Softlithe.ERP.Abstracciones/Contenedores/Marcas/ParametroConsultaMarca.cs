using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.Marcas
{
    public class ParametroConsultaMarca
    {
        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoEmpresaRequerida)]
        public int NoEmpresa { get; set; }
        public string Descripcion { get; set; } = string.Empty;
    }
}
