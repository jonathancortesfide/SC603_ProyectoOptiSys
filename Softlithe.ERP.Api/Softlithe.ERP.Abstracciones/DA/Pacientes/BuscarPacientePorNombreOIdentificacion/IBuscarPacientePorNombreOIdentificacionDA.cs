using Softlithe.ERP.Abstracciones.Contenedores.Pacientes;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Pacientes.BuscarPacientePorNombreOIdentificacion
{
	public interface IBuscarPacientePorNombreOIdentificacionDA
	{
		Task<List<PacienteDto>> Obtener(string parametroDeBusqueda);
	}
}
