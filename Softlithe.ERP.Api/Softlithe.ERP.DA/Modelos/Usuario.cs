using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Softlithe.ERP.DA.Modelos
{
	[Table("admin_user")]
	public class Usuario
	{
		[Key]
		[Column("no_usuario")]
		public int no_usuario { get; set; }

		[Column("nombre_usuario")]
		public string nombre_usuario { get; set; } = string.Empty;

		[Column("correo")]
		public string correo { get; set; } = string.Empty;

		[Column("contraseña_hash")]
		public string contraseña_hash { get; set; } = string.Empty;

		[Column("es_activo")]
		public bool es_activo { get; set; }

		[Column("fecha_creacion")]
		public DateTime fecha_creacion { get; set; }

		[Column("fecha_modificacion")]
		public DateTime? fecha_modificacion { get; set; }
	}
}
