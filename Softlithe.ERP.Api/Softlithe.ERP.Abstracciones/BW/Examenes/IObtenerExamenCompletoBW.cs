using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Examenes
{
    public interface IObtenerExamenCompletoBW
    {
        Task<ModeloValidacionConDatos<List<ExamenGraduacionDto>>> ObtenerPorNoPaciente(int noPaciente);
        Task<ModeloValidacionConDatos<List<ExamenGraduacionDto>>> ObtenerPorNumeroExamen(int noExamen);
        Task<ModeloValidacionConDatos<List<ExamenGraduacionDto>>> ObtenerPorCriterios(int? noExamen, int? noPaciente);
    }
}
