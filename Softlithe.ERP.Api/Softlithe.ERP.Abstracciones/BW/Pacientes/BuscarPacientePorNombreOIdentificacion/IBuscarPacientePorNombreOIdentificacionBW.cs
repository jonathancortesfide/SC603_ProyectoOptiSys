using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Pacientes.BuscarPacientePorNombreOIdentificacion
{
	public interface IBuscarPacientePorNombreOIdentificacionBW
	{
		Task<List<PacienteDto>> Obtener(string parametroDeBusqueda);
	}
}
