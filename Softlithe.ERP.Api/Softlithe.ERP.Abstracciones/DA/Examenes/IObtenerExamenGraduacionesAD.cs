using Softlithe.ERP.Abstracciones.Contenedores.Examenes;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Examenes
{
    public interface IObtenerExamenGraduacionesAD
    {
        Task<List<ExamenGraduacionDto>> Obtener(int noPaciente);
        Task<List<ExamenGraduacionDto>> ObtenerPorNumeroExamen(int noExamen);
        Task<List<ExamenGraduacionDto>> ObtenerPorCriterios(int? noExamen, int? noPaciente);
    }
}
