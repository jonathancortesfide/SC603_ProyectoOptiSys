using Softlithe.ERP.Abstracciones.BW.Examenes.AgregarExamen;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using Softlithe.ERP.Abstracciones.Contenedores.MensajesDelSistema;
using Softlithe.ERP.Abstracciones.DA.Examenes.AgregarExamen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Examenes.AgregarExamen
{
	public class AgregarExamenBW: IAgregarExamenBW
	{
		private readonly IAgregarExamenDA _agregarExamenDA;
		public AgregarExamenBW(IAgregarExamenDA agregarExamenDA)
		{
			_agregarExamenDA = agregarExamenDA;
		}
		public async Task<ModeloValidacion> Agregar(AgregarExamenDto datos)
		{
			ModeloValidacion modeloValidacion = GenerarModeloDeValidacion(false, MensajesDeExamenesDto.ExamenNoAgregado);
			int resultado = await _agregarExamenDA.Agregar(datos);
			if (resultado > 0)
			{
				modeloValidacion = GenerarModeloDeValidacion(false, MensajesDeExamenesDto.ExamenAgregadoCorrectamente);
			}
			return modeloValidacion;	
		}

		private ModeloValidacion GenerarModeloDeValidacion (bool esValido, string mensaje)
		{
			return new ModeloValidacion {
				EsCorrecto = false,
				Mensaje = mensaje
			};
		}
	}
}
