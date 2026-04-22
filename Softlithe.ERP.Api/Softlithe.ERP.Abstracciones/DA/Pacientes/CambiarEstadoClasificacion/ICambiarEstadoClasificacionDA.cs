using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.DA.Pacientes.CambiarEstadoClasificacion
{
    public interface ICambiarEstadoClasificacionDA
    {
        Task<ModeloValidacion> CambiarEstado(int no_clasificacion, string usuario, bool activo);
    }
}
