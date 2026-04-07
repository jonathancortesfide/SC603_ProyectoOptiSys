using Softlithe.ERP.Abstracciones.Contenedores.GestionBitacora;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.GestionBitacora.AgregarEventoBitacora
{
	public interface IAgregarEventoBitacoraDA
	{
		Task<int> Agregar(BitacoraDto laBitacoraParaGuardar);
	}
}
