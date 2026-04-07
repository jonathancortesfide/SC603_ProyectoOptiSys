using Softlithe.ERP.Abstracciones.BW.Pacientes.ActualizarPaciente;
using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.DA.Pacientes.ActualizarPaciente;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Pacientes.ActualizarPaciente
{
	public class ActualizarPacienteBW : IActualizarPacienteBW
	{
		private readonly IActualizarPacienteDA _actualizarPacienteDA;

		public ActualizarPacienteBW(IActualizarPacienteDA actualizarPacienteDA)
		{
			_actualizarPacienteDA = actualizarPacienteDA;
		}

		public async Task<ModeloValidacion> Actualizar(int numeroDePaciente, PacienteDto elPaciente)
		{
			try
			{
				var resultado = await _actualizarPacienteDA.Actualizar(numeroDePaciente, elPaciente);
				return new ModeloValidacion { EsCorrecto = resultado, Mensaje = resultado ? "Paciente actualizado correctamente." : "No se pudo actualizar el paciente." };
			}
			catch (Exception ex)
			{
				return new ModeloValidacion { EsCorrecto = false, Mensaje = ex.Message };
			}
		}
	}
}
