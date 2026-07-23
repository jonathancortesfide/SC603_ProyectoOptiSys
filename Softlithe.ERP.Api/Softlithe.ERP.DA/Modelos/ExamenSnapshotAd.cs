using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos
{
    [Table("ExamenSnapshot")]
    public class ExamenSnapshotAd
    {
        [Column("id_examen")]
        public int id_examen { get; set; }

        [Column("no_examen")]
        public int no_examen { get; set; }

        [Column("no_paciente")]
        public int no_paciente { get; set; }

        [Column("fecha_examen")]
        public DateTime fecha_examen { get; set; }

        [Column("nombre_paciente")]
        public string nombre_paciente { get; set; }

        [Column("id_profesional")]
        public int id_profesional { get; set; }

        [Column("nombre_profesional")]
        public string nombre_profesional { get; set; }

        [Column("codigo_profesional")]
        public string codigo_profesional { get; set; }

        [Column("motivo_consulta")]
        public string motivo_consulta { get; set; }

        [Column("observaciones_generales")]
        public string observaciones_generales { get; set; }

        [Column("tipo_lente_id")]
        public int? tipo_lente_id { get; set; }

        [Column("tipo_lente")]
        public string tipo_lente { get; set; }

        [Column("material_id")]
        public int? material_id { get; set; }

        [Column("material")]
        public string material { get; set; }

        [Column("codigo_aro")]
        public int? codigo_aro { get; set; }

        [Column("aro")]
        public string aro { get; set; }

        [Column("laboratorio")]
        public string laboratorio { get; set; }

        [Column("numero_orden_laboratorio")]
        public string numero_orden_laboratorio { get; set; }

        [Column("disposicion")]
        public string disposicion { get; set; }

        [Column("tratamiento")]
        public string tratamiento { get; set; }

        [Column("costo_examen")]
        public decimal? costo_examen { get; set; }

        [Column("costo_material")]
        public decimal? costo_material { get; set; }

        [Column("costo_lente")]
        public decimal? costo_lente { get; set; }

        [Column("costo_aro")]
        public decimal? costo_aro { get; set; }

        [Column("precio_final")]
        public decimal? precio_final { get; set; }

        [Column("estado")]
        public string estado { get; set; }

        [Column("xml_graduaciones")]
        public string xml_graduaciones { get; set; }

        [Column("fecha_creacion")]
        public DateTime fecha_creacion { get; set; }
    }
}