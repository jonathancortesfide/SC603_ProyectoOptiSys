using System;

namespace Softlithe.ERP.Abstracciones.Contenedores.Examenes
{
    public class ExamenGraduacionDto
    {
        public int id_graduacion { get; set; }
        public string? abreviatura { get; set; }
        public decimal resultado_valor { get; set; }
        public string? posicion { get; set; }
        public string? posicion_nombre { get; set; }
        public string? nombrePaciente { get; set; }
    }
}
