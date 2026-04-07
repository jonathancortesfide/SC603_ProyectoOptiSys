using Softlithe.ERP.Abstracciones.Servicios;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;

namespace Softlithe.ERP.BW
{
	public class TokenService : ITokenService
	{
		private readonly string _secretKey;
		private readonly string _issuer;
		private readonly string _audience;
		private readonly int _expirationMinutes;

		public TokenService(string secretKey, string issuer, string audience, int expirationMinutes = 60)
		{
			_secretKey = secretKey;
			_issuer = issuer;
			_audience = audience;
			_expirationMinutes = expirationMinutes;
		}

		public string GenerarToken(int noUsuario, string nombreUsuario, string correo)
		{
			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secretKey));
			var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

			var claims = new List<Claim>
			{
				new Claim(ClaimTypes.NameIdentifier, noUsuario.ToString()),
				new Claim(ClaimTypes.Name, nombreUsuario),
				new Claim(ClaimTypes.Email, correo),
				new Claim("noUsuario", noUsuario.ToString())
			};

			var token = new JwtSecurityToken(
				issuer: _issuer,
				audience: _audience,
				claims: claims,
				expires: DateTime.UtcNow.AddMinutes(_expirationMinutes),
				signingCredentials: credentials
			);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}
	}
}
