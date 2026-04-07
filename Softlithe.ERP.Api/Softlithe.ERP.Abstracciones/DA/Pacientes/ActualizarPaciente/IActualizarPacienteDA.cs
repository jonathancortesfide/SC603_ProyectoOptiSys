using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Pacientes.ActualizarPaciente
{
	public interface IActualizarPacienteDA
	{
		Task<bool> Actualizar(int numeroDePaciente, PacienteDto elPaciente);
	}
}
