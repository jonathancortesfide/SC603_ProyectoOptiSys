using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;

namespace Softlithe.ERP.Abstracciones.DA.Seguridad.Secciones
{
    public interface IObtenerSeccionesDA
    {
        Task<List<SeccionDto>> ObtenerSecciones();
    }

    public interface IAgregarSeccionDA
    {
        Task<ModeloValidacion> AgregarSeccion(AgregarSeccionDto Dto);
    }

    public interface IModificarEstadoSeccionDA
    {
        Task<ModeloValidacion> ModificarEstadoSeccion(ModificarEstadoSeccionDto Dto);
    }
}
