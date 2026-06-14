using System.Security.Cryptography;
using Softlithe.ERP.Abstracciones.BW.Autenticacion;

namespace Softlithe.ERP.BW.Autenticacion;

/// <summary>
/// Implementación PBKDF2-SHA256 sin dependencias externas de NuGet.
/// </summary>
public class PasswordService : IPasswordService
{
    private const int SaltSize = 16;
    private const int HashSize = 32;
    private const int Iterations = 100_000;

    public string HashPassword(string PlainPassword)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);

        using var pbkdf2 = new Rfc2898DeriveBytes(PlainPassword, salt, Iterations, HashAlgorithmName.SHA256);
        var hash = pbkdf2.GetBytes(HashSize);

        var result = new byte[SaltSize + HashSize];
        salt.CopyTo(result, 0);
        hash.CopyTo(result, SaltSize);

        return Convert.ToBase64String(result);
    }

    public bool VerifyPassword(string HashedPassword, string ProvidedPassword)
    {
        try
        {
            var hashBytes = Convert.FromBase64String(HashedPassword);
            if (hashBytes.Length != SaltSize + HashSize) return false;

            var salt = hashBytes[..SaltSize];

            using var pbkdf2 = new Rfc2898DeriveBytes(ProvidedPassword, salt, Iterations, HashAlgorithmName.SHA256);
            var computedHash = pbkdf2.GetBytes(HashSize);

            return CryptographicOperations.FixedTimeEquals(
                hashBytes.AsSpan(SaltSize),
                computedHash);
        }
        catch
        {
            return false;
        }
    }
}
