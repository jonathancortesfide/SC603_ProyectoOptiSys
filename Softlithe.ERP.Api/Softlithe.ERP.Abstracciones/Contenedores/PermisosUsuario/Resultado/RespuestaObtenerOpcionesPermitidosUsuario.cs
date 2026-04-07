using Softlithe.ERP.Abstracciones.Contenedores.PermisosUsuario.Comunes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.PermisosUsuario.Resultado
{
    public class RespuestaObtenerOpcionesPermitidosUsuario
    {
        public IEnumerable<Opciones>? lstOpciones { get; set; }

        public required ModeloValidacion ModeloValidacion { get; set; }
    }
}
