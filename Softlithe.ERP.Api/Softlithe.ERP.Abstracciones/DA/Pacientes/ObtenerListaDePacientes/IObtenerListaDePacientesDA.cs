using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Pacientes.ObtenerListaDePacientes
{
	public interface IObtenerListaDePacientesDA
	{
		Task<List<PacienteDto>> Obtener();
	}
}
