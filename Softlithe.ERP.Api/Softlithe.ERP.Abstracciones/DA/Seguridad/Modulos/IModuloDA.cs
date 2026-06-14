using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;

namespace Softlithe.ERP.Abstracciones.DA.Seguridad.Modulos
{
    public interface IObtenerModulosDA
    {
        Task<List<ModuloDto>> ObtenerModulos();
    }

    public interface IAgregarModuloDA
    {
        Task<ModeloValidacion> AgregarModulo(AgregarModuloDto Dto);
    }

    public interface IModificarEstadoModuloDA
    {
        Task<ModeloValidacion> ModificarEstadoModulo(ModificarEstadoModuloDto Dto);
    }
}
