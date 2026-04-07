using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.Marcas
{
    public class RespuestaCambiarEstadoMarcaDA
    {
        public MarcaDto ModeloMarca { get; set; }
        public int ResultadoRegistro { get; set; } = 0;
    }
}
