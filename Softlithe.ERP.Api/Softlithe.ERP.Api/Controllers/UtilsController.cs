using Microsoft.AspNetCore.Mvc;
using Softlithe.ERP.Abstracciones.Utilidades;

namespace Softlithe.ERP.Api.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class UtilsController : ControllerBase
	{
		/// <summary>
		/// Generate a BCrypt hash for a given password
		/// Usage: POST /api/utils/generate-hash?password=password123
		/// REMOVE THIS ENDPOINT IN PRODUCTION
		/// </summary>
		[HttpPost("generate-hash")]
		public IActionResult GenerateHash([FromQuery] string password)
		{
			if (string.IsNullOrWhiteSpace(password))
			{
				return BadRequest("Password is required");
			}

			try
			{
				// Generate hash using PasswordHelper
				string hash = PasswordHelper.HashPassword(password);
				
				// Verify it works
				bool isValid = PasswordHelper.VerifyPassword(password, hash);

				return Ok(new
				{
					password = password,
					hash = hash,
					verificationTest = isValid,
					sqlStatement = $"UPDATE [admin_user] SET [contraseña_hash] = '{hash}' WHERE [nombre_usuario] = 'admin';"
				});
			}
			catch (Exception ex)
			{
				return BadRequest($"Error: {ex.Message}");
			}
		}

		/// <summary>
		/// Verify if a password matches a hash
		/// Usage: POST /api/utils/verify-password?password=password123&hash=YOUR_HASH
		/// </summary>
		[HttpPost("verify-password")]
		public IActionResult VerifyPassword([FromQuery] string password, [FromQuery] string hash)
		{
			if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(hash))
			{
				return BadRequest("Password and hash are required");
			}

			try
			{
				bool isValid = PasswordHelper.VerifyPassword(password, hash);
				return Ok(new
				{
					password = password,
					hash = hash,
					isValid = isValid
				});
			}
			catch (Exception ex)
			{
				return BadRequest($"Error: {ex.Message}");
			}
		}
	}
}
