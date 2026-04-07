using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.TipoLente
{
    public class TipoLenteDto
    {
        public int no_tipo { get; set; }
        public string descripcion { get; set; }
        public int no_empresa { get; set; }
        public Boolean? Activo { get; set; }
        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.CodigoIdentificadorRequerido)]
        public int Identificador { get; set; }
        [Required(ErrorMessage = MensajesGeneralesDelSistemaDto.UsuarioRequerido)]
        public string Usuario { get; set; } = string.Empty;

    }

    public class TipoLenteConModeloDeValidacion : ModeloValidacion
    {
        public List<TipoLenteDto> TipoDeLente { get; set; } = new List<TipoLenteDto>();
    }
}
