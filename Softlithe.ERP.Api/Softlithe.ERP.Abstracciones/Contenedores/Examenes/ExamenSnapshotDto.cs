using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.Examenes
{
    public class ExamenSnapshotDto
    {
        public int id_examen { get; set; }
        public int no_examen { get; set; }
        public int no_paciente { get; set; }
        public DateTime fecha_examen { get; set; }
        public string nombre_paciente { get; set; }
        public int id_profesional { get; set; }
        public string nombre_profesional { get; set; }
        public string codigo_profesional { get; set; }
        public string motivo_consulta { get; set; }
        public string observaciones_generales { get; set; }
        public int? tipo_lente_id { get; set; }
        public string tipo_lente { get; set; }
        public int? material_id { get; set; }
        public string material { get; set; }
        public int? codigo_aro { get; set; }
        public string aro { get; set; }
        public string laboratorio { get; set; }
        public string numero_orden_laboratorio { get; set; }
        public string disposicion { get; set; }
        public string tratamiento { get; set; }
        public decimal? costo_examen { get; set; }
        public decimal? costo_material { get; set; }
        public decimal? costo_lente { get; set; }
        public decimal? costo_aro { get; set; }
        public decimal? precio_final { get; set; }
        public string estado { get; set; }
        public string xml_graduaciones { get; set; } // EF Core mapeará XML a string
        public DateTime fecha_creacion { get; set; }
    }
}