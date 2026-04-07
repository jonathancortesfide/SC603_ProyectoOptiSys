using Softlithe.ERP.Abstracciones.BW.Pacientes.AgregarPaciente;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.DA.Pacientes.AgregarPaciente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Pacientes.AgregarPaciente
{
	public class AgregarPacienteBW: IAgregarPacienteBW
	{

		private readonly IAgregarPacienteDA _agregarPacienteDA;

		public AgregarPacienteBW(IAgregarPacienteDA agregarPacienteDA)
		{
			_agregarPacienteDA = agregarPacienteDA;
		}

		public async Task<ModeloValidacion> Agregar(PacienteDto elPaciente)
		{
			ModeloValidacion elModeloDeValidacion = ConvierteAModeloDeValidacion(false, "No se realizo ningun registro");
			int cantidadDeDatosAgregados = await _agregarPacienteDA.Agregar(elPaciente);
			if (cantidadDeDatosAgregados == 1)
			{
				elModeloDeValidacion = ConvierteAModeloDeValidacion(true, "Registro exitoso");
			}
			return elModeloDeValidacion;
		}

		private ModeloValidacion ConvierteAModeloDeValidacion(bool esCorrecto, string mensaje)
		{
			return new ModeloValidacion
			{
				Mensaje = mensaje,
				EsCorrecto = esCorrecto
			};
		}
	}
}
