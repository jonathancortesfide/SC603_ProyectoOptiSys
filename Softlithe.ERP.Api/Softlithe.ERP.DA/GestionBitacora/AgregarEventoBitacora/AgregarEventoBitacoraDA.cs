
using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.DA.GestionBitacora.AgregarEventoBitacora;
using Softlithe.ERP.DA.Modelos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.DA.GestionBitacora.AgregarEventoBitacora
{
	public class AgregarEventoBitacoraDA: IAgregarEventoBitacoraDA
	{
		private readonly ContextoBasedeDatos _contextoBasedeDatos;
		public AgregarEventoBitacoraDA(ContextoBasedeDatos contextoBasedeDatos)
		{
			_contextoBasedeDatos = contextoBasedeDatos;
		}

		public async Task<int> Agregar(BitacoraDto laBitacoraParaGuardar)
		{
			try
			{
				Bitacora laNuevaBitacora = ConvertirBitacoraModelo(laBitacoraParaGuardar);
				_contextoBasedeDatos.Bitacoras.Add(laNuevaBitacora);
				int cantidadDeDatosGuardados = await _contextoBasedeDatos.SaveChangesAsync();
				return cantidadDeDatosGuardados;
			}
			catch (Exception ex)
			{
				_contextoBasedeDatos.ChangeTracker.Clear();
				throw new Exception("Error al agregar el evento a la bitacora: " + ex.Message + ". StackTrace: " + ex.StackTrace + ". Mensaje Inner Exception: " + ex.InnerException?.Message);
			}
		}

		private Bitacora ConvertirBitacoraModelo(BitacoraDto laBitacoraParaGuardar)
		{
			return new Bitacora
			{
				descripcionDelEvento = laBitacoraParaGuardar.descripcionDelEvento,
				fechaDeRegistro = laBitacoraParaGuardar.fechaDeRegistro,
				idBitacora = laBitacoraParaGuardar.idBitacora,
				identificador = laBitacoraParaGuardar.identificador,
				mensajeExcepcion = laBitacoraParaGuardar.mensajeExcepcion,
				nombreDelMetodo = laBitacoraParaGuardar.nombreDelMetodo,
				stackTrace = laBitacoraParaGuardar.stackTrace,
				tabla = laBitacoraParaGuardar.tabla,
				usuario = laBitacoraParaGuardar.usuario
			};
		}
	}
}
