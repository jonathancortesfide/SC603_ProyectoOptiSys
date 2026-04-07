using Softlithe.ERP.Abstracciones.DA.Autenticacion;
using Softlithe.ERP.DA.Modelos;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.Autenticacion
{
	public class AutenticacionDA : IAutenticacionDA
	{
		private readonly ContextoBasedeDatos _contextoBasedeDatos;

		public AutenticacionDA(ContextoBasedeDatos contextoBasedeDatos)
		{
			_contextoBasedeDatos = contextoBasedeDatos;
		}

		public async Task<(bool esValido, int noUsuario, string nombreUsuario, string correo)> ValidarCredenciales(string nombreUsuario, string contraseña)
		{
			try
			{
				System.Diagnostics.Debug.WriteLine($"\n=== AUTENTICACION DEBUG ===");
				System.Diagnostics.Debug.WriteLine($"Buscando usuario: {nombreUsuario}");

				var usuario = await _contextoBasedeDatos.Usuarios
					.FirstOrDefaultAsync(u => u.nombre_usuario == nombreUsuario && u.es_activo);

				if (usuario == null)
				{
					System.Diagnostics.Debug.WriteLine($"❌ Usuario no encontrado: {nombreUsuario}");
					return (false, 0, "", "");
				}

				System.Diagnostics.Debug.WriteLine($"✓ Usuario encontrado: {usuario.nombre_usuario}");
				System.Diagnostics.Debug.WriteLine($"  Email: {usuario.correo}");
				System.Diagnostics.Debug.WriteLine($"  Activo: {usuario.es_activo}");
				System.Diagnostics.Debug.WriteLine($"  Hash en BD: {usuario.contraseña_hash}");
				System.Diagnostics.Debug.WriteLine($"  Password recibida: {contraseña}");

				// Verificar contraseña usando BCrypt
				bool esValida = BCrypt.Net.BCrypt.Verify(contraseña, usuario.contraseña_hash);

				System.Diagnostics.Debug.WriteLine($"  Resultado Verify: {esValida}");

				if (esValida)
				{
					System.Diagnostics.Debug.WriteLine($"✓ ¡Contraseña válida!");
					return (true, usuario.no_usuario, usuario.nombre_usuario, usuario.correo);
				}

				System.Diagnostics.Debug.WriteLine($"❌ Contraseña inválida");
				System.Diagnostics.Debug.WriteLine($"=== FIN DEBUG ===\n");
				return (false, 0, "", "");
			}
			catch (Exception ex)
			{
				System.Diagnostics.Debug.WriteLine($"❌ ERROR en ValidarCredenciales: {ex.Message}");
				System.Diagnostics.Debug.WriteLine($"Stack Trace: {ex.StackTrace}");
				return (false, 0, "", "");
			}
		}
	}
}
