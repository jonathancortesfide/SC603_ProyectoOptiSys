using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores
{
    public class ModeloValidacion
    {
        public required string Mensaje { get; set; }
        public bool EsCorrecto { get; set; }
    }

    public class ModeloValidacionConDatos<T> : ModeloValidacion
    {
        public T? Datos { get; set; }
    }
}
