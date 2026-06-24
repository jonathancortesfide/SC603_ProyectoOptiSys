using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Examenes
{
    public interface IObtenerExamenCompletoBW
    {
        Task<ModeloValidacionConDatos<List<ExamenGraduacionDto>>> ObtenerPorNoPaciente(int noPaciente);

    }
}
