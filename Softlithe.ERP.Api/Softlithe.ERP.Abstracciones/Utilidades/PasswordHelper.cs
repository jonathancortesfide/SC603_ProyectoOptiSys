using BCrypt.Net;

namespace Softlithe.ERP.Abstracciones.Utilidades
{
	/// <summary>
	/// Utility class for password operations
	/// Usage: Use PasswordHelper.HashPassword("YourPassword") to generate a hash for database insertion
	/// </summary>
	public static class PasswordHelper
	{
		/// <summary>
		/// Generates a secure BCrypt hash for a password
		/// Use this hash value in the Usuario table's contraseña_hash column
		/// </summary>
		/// <param name="password">The plain text password to hash</param>
		/// <returns>A BCrypt hash string safe for database storage</returns>
		public static string HashPassword(string password)
		{
			return BCrypt.Net.BCrypt.HashPassword(password);
		}

		/// <summary>
		/// Verifies if a plain text password matches a BCrypt hash
		/// </summary>
		/// <param name="password">The plain text password to verify</param>
		/// <param name="hash">The BCrypt hash from the database</param>
		/// <returns>True if password matches, false otherwise</returns>
		public static bool VerifyPassword(string password, string hash)
		{
			return BCrypt.Net.BCrypt.Verify(password, hash);
		}

		/// <summary>
		/// Example usage:
		/// 
		/// // To generate a hash for a new password:
		/// string password = "MySecurePassword123!";
		/// string hash = PasswordHelper.HashPassword(password);
		/// Console.WriteLine($"Hash for database: {hash}");
		/// 
		/// // To verify a password during login:
		/// bool isValid = PasswordHelper.VerifyPassword(userProvidedPassword, databaseHash);
		/// </summary>
		public static void ShowExample()
		{
			Console.WriteLine("=== Password Hashing Examples ===\n");

			// Example 1: Generate hash
			string password = "Admin123!";
			string hash = HashPassword(password);
			Console.WriteLine($"Original Password: {password}");
			Console.WriteLine($"Generated Hash: {hash}\n");

			// Example 2: Verify password
			bool isCorrect = VerifyPassword(password, hash);
			bool isIncorrect = VerifyPassword("WrongPassword", hash);
			Console.WriteLine($"Verify 'Admin123!': {isCorrect}");
			Console.WriteLine($"Verify 'WrongPassword': {isIncorrect}\n");

			// Example 3: SQL Insert Statement
			Console.WriteLine("SQL INSERT Statement:");
			Console.WriteLine($"INSERT INTO [Usuario] ([nombre_usuario], [correo], [contraseña_hash], [es_activo], [fecha_creacion])");
			Console.WriteLine($"VALUES ('newuser', 'user@example.com', '{hash}', 1, GETDATE());");
		}
	}
}
