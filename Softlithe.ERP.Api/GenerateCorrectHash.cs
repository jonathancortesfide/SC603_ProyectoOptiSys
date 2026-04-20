using BCrypt.Net;

class HashGenerator
{
    static void Main()
    {
        Console.WriteLine("=== BCrypt Hash Generator ===\n");

        // Generate hash for password123
        string password = "password123";
        string correctHash = BCrypt.Net.BCrypt.HashPassword(password);

        Console.WriteLine($"Password: {password}");
        Console.WriteLine($"Generated Hash: {correctHash}");
        
        // Verify it works
        bool isValid = BCrypt.Net.BCrypt.Verify(password, correctHash);
        Console.WriteLine($"\nVerification Test: {isValid}");
        
        Console.WriteLine($"\n=== Use this hash in your SQL: ===");
        Console.WriteLine($"UPDATE [admin_user]");
        Console.WriteLine($"SET [contraseña_hash] = '{correctHash}'");
        Console.WriteLine($"WHERE [nombre_usuario] = 'admin';");
        
        Console.WriteLine($"\n\nOr use this in SetupAuthDatabase.sql:");
        Console.WriteLine($"'{correctHash}', -- \"password123\"");
    }
}
