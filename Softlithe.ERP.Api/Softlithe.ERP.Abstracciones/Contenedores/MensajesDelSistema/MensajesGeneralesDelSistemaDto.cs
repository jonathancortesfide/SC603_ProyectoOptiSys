using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema
{
	public static class MensajesGeneralesDelSistemaDto
	{
		public static string DatosObtenidosDeManeraCorrecta = "Datos obtenidos de manera correcta.";
		public static string OcurrioUnErrorEnElSistema = "Ocurrió un error en el sistema, contacte al encargado.";
		public static string EventoDeErrorInterno = "Ocurrió un error inesperado no controlado.";
		public static string EventoDeErrorInternoMensaje = "Error General: {0}. Error Inner Exception: {1}";
        public const string CodigoEmpresaRequerida = "El código de empresa es requerido.";
        public const string CodigoIdentificadorRequerido = "El código identificador es requerido.";
		public const string UsuarioRequerido = "El usuario es requerido.";
        public const string DatoEsActivoRequerido = "El dato es activo es requerido.";
        public const string ErrorGuardarBitacora = "Existen inconvenientes al guardar la bitácora, contacte al encargado. ";
    }
}
