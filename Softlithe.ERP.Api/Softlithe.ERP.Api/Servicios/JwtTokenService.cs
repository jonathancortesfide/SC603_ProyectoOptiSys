using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Softlithe.ERP.Abstracciones.Contenedores.Autenticacion;

namespace Softlithe.ERP.Api.Servicios;

public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _configuration;

    public JwtTokenService(IConfiguration Configuration)
    {
        _configuration = Configuration;
    }

    public string GenerarToken(UsuarioSesionDto Usuario)
    {
        var secret = _configuration["JwtConfig:Secret"]
            ?? throw new InvalidOperationException("JwtConfig:Secret no configurado.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, Usuario.Id),
            new Claim(JwtRegisteredClaimNames.Email, Usuario.Email),
            new Claim(JwtRegisteredClaimNames.Name, Usuario.DisplayName),
            new Claim(JwtRegisteredClaimNames.Iat,
                DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                ClaimValueTypes.Integer64)
        };

        var expirationHours = int.Parse(
            _configuration["JwtConfig:ExpirationHours"] ?? "8");

        var token = new JwtSecurityToken(
            issuer: _configuration["JwtConfig:Issuer"],
            audience: _configuration["JwtConfig:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddHours(expirationHours),
            signingCredentials: credentials);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
