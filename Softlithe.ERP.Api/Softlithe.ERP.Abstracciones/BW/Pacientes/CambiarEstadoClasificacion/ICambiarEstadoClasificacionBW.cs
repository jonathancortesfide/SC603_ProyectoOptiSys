using Softlithe.ERP.Abstracciones.Contenedores;
using System.Threading.Tasks;

namespace Softlithe.ERP.Abstracciones.BW.Pacientes.CambiarEstadoClasificacion
{
    public interface ICambiarEstadoClasificacionBW
    {
        Task<ModeloValidacion> CambiarEstado(int no_clasificacion, int identificador, string usuario, bool activo);
    }
}
