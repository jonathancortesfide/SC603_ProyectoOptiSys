using Softlithe.ERP.Abstracciones.Contenedores.Autenticacion;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Autenticacion
{
	public interface IAutenticacionBW
	{
		Task<LoginResponseDto> Login(LoginDto credenciales);
	}
}
