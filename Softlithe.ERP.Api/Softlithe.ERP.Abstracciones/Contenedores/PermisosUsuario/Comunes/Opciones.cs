using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.PermisosUsuario.Comunes
{
    public class Opciones
    {
        public int numeroOpcion { get; set; }

        public  string? descripcionOpcion { get; set; }

        public bool tienePermiso { get; set; }
    }
}
