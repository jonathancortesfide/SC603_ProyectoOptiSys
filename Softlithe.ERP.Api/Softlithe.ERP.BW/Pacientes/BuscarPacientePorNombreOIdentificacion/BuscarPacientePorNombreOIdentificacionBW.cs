using Softlithe.ERP.Abstracciones.BW.Pacientes.BuscarPacientePorNombreOIdentificacion;
using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using Softlithe.ERP.Abstracciones.DA.Pacientes.BuscarPacientePorNombreOIdentificacion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.BW.Pacientes.BuscarPacientePorNombreOIdentificacion
{
	public class BuscarPacientePorNombreOIdentificacionBW: IBuscarPacientePorNombreOIdentificacionBW
	{

		private readonly IBuscarPacientePorNombreOIdentificacionDA _buscarPacientePorNombreOIdentificacionDA;

		public BuscarPacientePorNombreOIdentificacionBW(IBuscarPacientePorNombreOIdentificacionDA buscarPacientePorNombreOIdentificacionDA)
		{
			_buscarPacientePorNombreOIdentificacionDA = buscarPacientePorNombreOIdentificacionDA;
		}

		public async Task<List<PacienteDto>> Obtener(string parametroDeBusqueda)
		{
			return await _buscarPacientePorNombreOIdentificacionDA.Obtener(parametroDeBusqueda);
		}

	}
}
