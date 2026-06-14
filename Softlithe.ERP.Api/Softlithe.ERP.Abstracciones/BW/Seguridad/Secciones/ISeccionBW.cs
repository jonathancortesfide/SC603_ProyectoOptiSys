using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;

namespace Softlithe.ERP.Abstracciones.BW.Seguridad.Secciones
{
    public interface IObtenerSeccionesBW
    {
        Task<SeccionConModeloDeValidacion> ObtenerSecciones();
    }

    public interface IAgregarSeccionBW
    {
        Task<ModeloValidacion> AgregarSeccion(AgregarSeccionDto Dto);
    }

    public interface IModificarEstadoSeccionBW
    {
        Task<ModeloValidacion> ModificarEstadoSeccion(ModificarEstadoSeccionDto Dto);
    }
}
