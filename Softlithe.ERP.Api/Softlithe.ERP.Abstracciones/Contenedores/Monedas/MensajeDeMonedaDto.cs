namespace Softlithe.ERP.Abstracciones.Contenedores.Monedas
{
	public static class MensajeDeMonedaDto
	{
		public const string MonedaAgregadaCorrectamente = "La moneda ha sido agregada correctamente.";
		public const string MonedaModificadaCorrectamente = "La moneda ha sido modificada correctamente.";
		public const string MonedaEliminadaCorrectamente = "La moneda ha sido eliminada correctamente.";
		public const string MonedaNoGuardar = "La moneda no pudo ser guardada. Intente nuevamente.";
		public const string CodigoMonedaRequerida = "El código de moneda es requerido.";
		public const string NombreMonedaRequerida = "La descripción de la moneda es requerida.";
		public const string MonedaNacionalNoSeDebeEliminar = "No se puede eliminar la moneda nacional.";
		public const string MonedaTieneReferenciasEnOtrasTablas = "No se puede eliminar esta moneda porque está siendo utilizada en otras operaciones del sistema.";
		public const string EstadoMonedaCambiadoCorrectamente = "El estado de la moneda ha sido cambiado correctamente.";
		public const string ErrorCambiarEstadoMoneda = "El estado de la moneda no pudo ser cambiado. Intente nuevamente.";
	}
}
