using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Pacientes.ActualizarPaciente
{
	public interface IActualizarPacienteBW
	{
		Task<ModeloValidacion> Actualizar(int numeroDePaciente, PacienteDto elPaciente);
	}
}
