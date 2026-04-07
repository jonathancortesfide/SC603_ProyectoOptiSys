using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.FE.Abstracciones.Contenedores.Utilidades.Constantes
{
    public enum ConstanteGeneral
    {
        [EnumMember(Value = "ErrorCargarDatos"), Description("Ocurrió inconveniente al cargar los datos")]
        ErrorCargarDatos = 1
    }
}
