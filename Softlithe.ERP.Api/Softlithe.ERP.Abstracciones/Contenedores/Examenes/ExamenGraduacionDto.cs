using System;

namespace Softlithe.ERP.Abstracciones.Contenedores.Examenes
{
    public class ExamenGraduacionDto
    {
        // Columns returned by the stored procedure (segundo resultset)
        public int id_graduacion { get; set; }
        public string? nombre { get; set; }
        public string? abreviatura { get; set; }
        public int id_tipo_graduacion { get; set; }
        public string? tipo_xml { get; set; }
        public string? tipo_graduacion { get; set; }
        public int orden { get; set; }
        public decimal resultado_valor { get; set; }
        public string? posicion { get; set; }
        public string? posicion_nombre { get; set; }

        // Propiedades históricas / de compatibilidad
        // Mantener si siguen siendo utilizadas en otras capas
        public string? nombrePaciente { get; set; }
    }
}
