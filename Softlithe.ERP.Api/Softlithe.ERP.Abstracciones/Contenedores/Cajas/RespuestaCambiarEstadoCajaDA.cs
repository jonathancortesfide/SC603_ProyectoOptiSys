namespace Softlithe.ERP.Abstracciones.Contenedores.Cajas;

public class RespuestaCambiarEstadoCajaDA
{
    public int ResultadoRegistro { get; set; }

    public CajaDto ModeloCaja { get; set; } = new();
}
