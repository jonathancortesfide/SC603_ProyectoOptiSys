using Softlithe.ERP.Abstracciones.BW.Generales.Fecha;
using Softlithe.ERP.Abstracciones.BW.Generales.GestionDeBitacora.AgregarEventoBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.DA.GestionBitacora.AgregarEventoBitacora;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Generales.GestionDeBitacora.AgregarEventoBitacora
{
	public class AgregarEventoBitacoraBW: IAgregarEventoBitacoraBW
	{
		private readonly IAgregarEventoBitacoraDA _agregarEventoBitacoraDA;
		private readonly IGestionDeFecha _gestionDeFecha;
		public AgregarEventoBitacoraBW(IAgregarEventoBitacoraDA agregarEventoBitacoraDA,
									   IGestionDeFecha gestionDeFecha)
		{
			_agregarEventoBitacoraDA = agregarEventoBitacoraDA;
			_gestionDeFecha = gestionDeFecha;
		}

		public async Task<int> AgregarEventoBitacora(BitacoraDto laBitacoraParaGuardar)
		{
			try
			{
				int resultado = await _agregarEventoBitacoraDA.Agregar(laBitacoraParaGuardar);
				return resultado;
			}
			catch (Exception ex)
			{
				return 0;
			}
		}
		public BitacoraDto ConstruirObjetoBitacora(
			  string descripcionDelEvento
			, string usuario
			, int identificador
			, string mensajeExcepcion
			, string nombreDelMetodo
			, string stackTrace
			, string tabla)
		{
			return new BitacoraDto { 
				fechaDeRegistro = _gestionDeFecha.ObtenerFechaActual(),
				descripcionDelEvento = descripcionDelEvento,
				usuario = usuario,
				idBitacora = Guid.NewGuid(),
				identificador = identificador,
				mensajeExcepcion = mensajeExcepcion,
				nombreDelMetodo = nombreDelMetodo,
				stackTrace = stackTrace,
				tabla = tabla
			};
		}
	}
}
