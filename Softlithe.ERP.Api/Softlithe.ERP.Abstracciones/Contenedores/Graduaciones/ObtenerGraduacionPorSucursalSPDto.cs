using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.Graduaciones
{
    public class ObtenerGraduacionPorSucursalSPDto
    {
        public int IdEstructuraGraduacion { get; set; }

        public short IdTipoGraduacion { get; set; }

        public string? TipoGraduacion { get; set; }

        public short IdGraduacion { get; set; }

        public string? Nombre { get; set; }

        public string? Abreviatura { get; set; }

        public string? DescripcionTecnica { get; set; }

        public int Identificador { get; set; }

        public short Orden { get; set; }

        public bool Activo { get; set; }
    }
}
