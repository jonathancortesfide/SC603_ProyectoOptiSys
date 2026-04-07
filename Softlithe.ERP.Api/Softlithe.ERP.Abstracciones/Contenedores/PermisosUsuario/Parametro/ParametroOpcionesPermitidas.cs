using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.PermisosUsuario.Parametro
{
    public class ParametroOpcionesPermitidas
    {

        public int codigoModulo { get; set; }
        public int identificador { get; set; }

        public required string  login { get; set; }
    }
}
