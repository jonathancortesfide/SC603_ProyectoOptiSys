using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Softlithe.ERP.Abstracciones.Contenedores.Autenticacion;
using Softlithe.ERP.Abstracciones.DA.Seguridad.UsuarioRoles;

namespace Softlithe.ERP.Api.Servicios;

public class JwtTokenService : IJwtTokenService
{
    private readonly IConfiguration _configuration;
    private readonly IObtenerPermisosEfectivosUsuarioDA _permisosDA;

    public JwtTokenService(IConfiguration Configuration, IObtenerPermisosEfectivosUsuarioDA permisosDA)
    {
        _configuration = Configuration;
        _permisosDA = permisosDA;
    }

    public async Task<string> GenerarTokenAsync(UsuarioSesionDto Usuario)
    {
        var secret = _configuration["JwtConfig:Secret"]
            ?? throw new InvalidOperationException("JwtConfig:Secret no configurado.");

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, Usuario.Id),
            new Claim(JwtRegisteredClaimNames.Email, Usuario.Email),
            new Claim(JwtRegisteredClaimNames.Name, Usuario.DisplayName ?? string.Empty),
            new Claim("nombre", Usuario.DisplayName ?? string.Empty),
            new Claim(JwtRegisteredClaimNames.Iat,
                DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                ClaimValueTypes.Integer64)
        };

        if (int.TryParse(Usuario.Id, out int idUsuario) && idUsuario > 0)
        {
            var permisos = await _permisosDA.ObtenerPermisosEfectivos(idUsuario);
            foreach (var p in permisos)
                claims.Add(new Claim("permiso", p.CodigoPermiso));
        }

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
