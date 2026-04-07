using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.Examenes
{
	public class AgregarExamenDto
	{
		public int NoExamen { get; set; }
		public int NoPaciente { get; set; }
		public DateTime FechaExamen { get; set; }
		public string Motivo { get; set; }
		public string TipoExamen { get; set; }
		public string DpGeneral { get; set; }
		public string MedioTransp { get; set; }
		public string Fo { get; set; }
		public string Pio { get; set; }
		public int NumeroEmpresa { get; set; }
		public string Estado { get; set; }
		public DateTime UltimoExamen { get; set; }
		public string TratamientoAnterior { get; set; }
		public string ModoUso { get; set; }
		public string TipoPatologias { get; set; }
		public string TieneDiseno { get; set; }
		public string TieneAro { get; set; }
		public string TipoDml { get; set; }
		public decimal Diagonal { get; set; }
		public decimal Vertical { get; set; }
		public decimal Puente { get; set; }
		public decimal Horizontal { get; set; }
		public string XmlPatologias { get; set; }
		public string XmlGraduaciones { get; set; }
		public string XmlDisenos { get; set; }
		public string CodigoAro { get; set; }
		public byte[] Imagen { get; set; }
		public string CodigoExamen { get; set; }
		public int NumeroProveedorLaboratorio { get; set; }
		public string NumeroOrdenLaboratorio { get; set; }
		public string NumeroPedidoLaboratorio { get; set; }
		public string codigoLenteContacto { get; set; }
	}
}
