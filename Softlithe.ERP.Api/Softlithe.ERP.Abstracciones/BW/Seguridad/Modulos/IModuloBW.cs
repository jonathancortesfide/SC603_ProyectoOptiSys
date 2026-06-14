using Softlithe.ERP.Abstracciones.Contenedores;
using Softlithe.ERP.Abstracciones.Contenedores.Seguridad;

namespace Softlithe.ERP.Abstracciones.BW.Seguridad.Modulos
{
    public interface IObtenerModulosBW
    {
        Task<ModuloConModeloDeValidacion> ObtenerModulos();
    }

    public interface IAgregarModuloBW
    {
        Task<ModeloValidacion> AgregarModulo(AgregarModuloDto Dto);
    }

    public interface IModificarEstadoModuloBW
    {
        Task<ModeloValidacion> ModificarEstadoModulo(ModificarEstadoModuloDto Dto);
    }
}
