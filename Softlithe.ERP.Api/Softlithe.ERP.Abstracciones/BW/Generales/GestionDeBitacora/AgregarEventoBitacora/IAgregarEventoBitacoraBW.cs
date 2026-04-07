using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora
{
	public interface IAgregarEventoBitacoraBW
	{
		Task<int> AgregarEventoBitacora(BitacoraDto laBitacoraParaGuardar);
		BitacoraDto ConstruirObjetoBitacora(string descripcionDelEvento, string usuario, int identificador, string mensajeExcepcion, string nombreDelMetodo, string stackTrace, string tabla);
	}
}
