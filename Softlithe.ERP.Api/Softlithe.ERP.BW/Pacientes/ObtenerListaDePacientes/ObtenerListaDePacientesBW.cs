using Softlithe.ERP.Abstracciones.BW.Pacientes.ObtenerListaDePacientes;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.DA.Pacientes.ObtenerListaDePacientes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Pacientes.ObtenerListaDePacientes
{
	public class ObtenerListaDePacientesBW: IObtenerListaDePacientesBW
	{

		private readonly IObtenerListaDePacientesDA _obtenerListaDePacientesDA;

		public ObtenerListaDePacientesBW(IObtenerListaDePacientesDA obtenerListaDePacientesDA) {
			_obtenerListaDePacientesDA = obtenerListaDePacientesDA;
		}

		public async Task<List<PacienteDto>> Obtener()
		{
			List<PacienteDto> laListaDePacientes = await _obtenerListaDePacientesDA.Obtener();
			return laListaDePacientes;
		}
	}
}
