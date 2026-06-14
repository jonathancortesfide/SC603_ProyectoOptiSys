namespace Softlithe.ERP.Abstracciones.Contenedores.CajaMovimientos;

public static class MensajeDeCajaMovimientoDto
{
    public const string MovimientoAgregadoCorrectamente = "El movimiento de caja fue registrado correctamente.";
    public const string MovimientoNoGuardado = "No fue posible registrar el movimiento de caja. ";
    public const string AperturaRealizadaCorrectamente = "La apertura de caja fue registrada correctamente.";
    public const string AperturaNoRealizada = "No fue posible realizar la apertura de caja. ";
    public const string CierreActivoExistente = "La caja ya tiene un cierre activo.";
    public const string CajaInactiva = "La caja seleccionada no está activa.";
    public const string CajaNoEncontrada = "No se encontró la caja indicada.";
    public const string CierreNoAbierto = "El cierre de caja no está abierto.";
    public const string TipoMovimientoAperturaNoEncontrado = "No se encontró el tipo de movimiento de apertura.";
    public const string CodigoCierreRequerido = "El id de cierre (id_cierre) es requerido.";
    public const string CodigoTipoMovimientoRequerido = "El tipo de movimiento es requerido.";
    public const string CodigoMonedaRequerido = "La moneda es requerida.";
    public const string MontoRequerido = "El monto es requerido.";
    public const string CodigoUsuarioRequerido = "El id de usuario es requerido.";
}
