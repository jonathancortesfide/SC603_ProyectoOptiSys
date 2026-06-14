namespace Softlithe.ERP.Abstracciones.BW.Autenticacion;

public interface IPasswordService
{
    string HashPassword(string PlainPassword);
    bool VerifyPassword(string HashedPassword, string ProvidedPassword);
}
